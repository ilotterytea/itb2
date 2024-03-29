// Copyright (C) 2022 NotDankEnough (ilotterytea)
// 
// This file is part of itb2.
// 
// itb2 is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// itb2 is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with itb2.  If not, see <http://www.gnu.org/licenses/>.

import { Logger } from "tslog";
import express from "express";
import http from "http";
import https from "https";
import IConfiguration from "../apollo/interfaces/IConfiguration";
import { readFileSync } from "fs";
import TwitchApi from "../apollo/clients/ApiClient";
import { PrismaClient } from "@prisma/client";
import ChannelRoute from "./routes/ChannelRoute";
import CatalogueRoute from "./routes/CatalogueRoute";
import CommandsRoute from "./routes/CommandsRoute";
import { HomeRoute } from "./routes/HomeRoute";
import ApiRoute from "./routes/ApiRoute";
import Localizator from "../apollo/utils/Locale";
import { Client } from "tmi.js";

const log: Logger = new Logger({name: "www-serverinit"});

async function ServerInit(opts: {[key: string]: string}, locale: Localizator, prisma: PrismaClient, ttvapi: TwitchApi.Client, cfg: IConfiguration) {
    
    try {
        const client = new Client({
            identity: {
                username: cfg.Authorization.Username,
                password: cfg.Authorization.Password
            },
            channels: ["ilotterytea"]
        });

        client.connect();

        const App = express();
        App.set("view engine", "ejs");
        App.set("views", `${__dirname}/views`);

        App.use("/channel", ChannelRoute(prisma, ttvapi));
        App.use("/catalogue", CatalogueRoute(prisma, ttvapi, cfg));
        App.use("/commands", CommandsRoute(cfg));
        App.use("/api/v1", ApiRoute(client, locale, cfg));
        App.use("/", HomeRoute(prisma, cfg));

        App.use(express.static(`${__dirname}/static`));
        if (opts.debug) {
            const httpc = http.createServer(App).listen(8080, () => {
                log.debug("The bot web server is running on port", "8080");
            });
            process.on("SIGHUP", (signal) => {
                httpc.close();
                client.disconnect();
            });
        } else {
            var credentials = {
                key: readFileSync(cfg.Web.Private, {encoding: "utf-8"}),
                cert: readFileSync(cfg.Web.Certificate, {encoding: "utf-8"}),
                ca: readFileSync(cfg.Web.Chain, {encoding: "utf-8"})
            };

            const httpc = http.createServer(App).listen(80, () => {
                log.debug("The bot's web HTTP server is running on port", "80");
            });
            
            const httpsc = https.createServer(credentials, App).listen(443, () => {
                log.debug( "The bot's web HTTPS server is running on port", "443");
            });
            process.on("SIGHUP", (signal) => {
                httpc.close();
                httpsc.close();
                client.disconnect();
            });
        }
    } catch (err) {
        log.error(err);
    }
}

export default ServerInit;