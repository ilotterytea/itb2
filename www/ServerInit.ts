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
import { readdirSync, readFileSync } from "fs";
import TwitchApi from "../apollo/clients/ApiClient";
import IStorage from "../apollo/interfaces/IStorage";
import LocalStorage from "../apollo/files/LocalStorage";
import { Emotes, PrismaClient, Target, Timers } from "@prisma/client";

const log: Logger = new Logger({name: "www-serverinit"});

async function ServerInit(opts: {[key: string]: string}, prisma: PrismaClient, ttvapi: TwitchApi.Client, cfg: IConfiguration) {
    
    try {
        const App = express();
        App.set("view engine", "ejs");
        App.set("views", `${__dirname}/views`);

        App.get("/", (req, res) => {
            res.render("pages/home", {
                botn: "fembajbot"
            });
        });

        App.get("/commands", (req, res) => {
            const cmds: {[key: string]: any} = JSON.parse(readFileSync("www/static/metadata/cmds.json", {encoding: "utf-8"}));

            res.render("pages/commands", {
                cmds: cmds
            });
        });

        App.get("/commands/:namespaceId", (req, res) => {
            const cmds: {[key: string]: any} = JSON.parse(readFileSync("www/static/metadata/cmds.json", {encoding: "utf-8"}));

            if (!(req.params.namespaceId in cmds)) {
                res.render("pages/error", {
                    status: 404,
                    message: "The command with ID " + req.params.namespaceId +" does not exist.",
                    kitty: "https://http.cat/404"
                });
                return;
            }
            if ("isHidden" in cmds[req.params.namespaceId]) {
                if (cmds[req.params.namespaceId].isHidden == true) {
                    res.render("pages/error", {
                        status: 401,
                        message: "The command with ID " + req.params.namespaceId +" is hidden from public view.",
                        kitty: "https://http.cat/401"
                    });
                    return;
                }
            }

            res.render("pages/commandpage", {
                cmd: cmds[req.params.namespaceId],
                cmds: cmds,
                bot_name: "fembajbot"
            });
        });

        App.get("/about", (req, res) => {
            res.render("pages/home", {
                botn: "fembajbot"
            });
        });

        App.get("/catalogue", async (req, res) => {
            var channels: Target[] | null = await prisma.target.findMany();
            var users: any[] = [];
            
            if (!channels) {
                return res.render("pages/error", {
                    status: 500,
                    message: "Something went wrong.",
                    kitty: "https://http.cat/500"
                });
            }

            channels = channels.filter(c => c.id !== -72);

            for await (const channel of channels) {
                const user = await ttvapi.getUserById(channel.alias_id);
                if (!user) return;
                users.push(user);
            }

            res.render("pages/catalogue", {
                users: users,
                itb2: channels,
                bot_name: "fembajbot"
            });
        });

        App.get("/channel/:id", async (req, res) => {
            const channel: Target | null = await prisma.target.findFirst({
                where: {
                    alias_id: parseInt(req.params.id)
                }
            });

            if (!channel) {
                return res.render("pages/error", {
                    status: 404,
                    message: "Target with ID " + req.params.id + " not found.",
                    kitty: "https://http.cat/404"
                });
            }

            const emotes: Emotes[] | null = await prisma.emotes.findMany({
                where: {
                    targetId: channel.id
                },
                orderBy: {
                    used_times: "desc"
                }
            });

            var ttvdata = await ttvapi.getUserById(parseInt(req.params.id));

            res.render("pages/channel", {
                itb: channel,
                itb_7tvemotes: emotes.filter(e => e.provider === "stv"),
                itb_bttvemotes: emotes.filter(e => e.provider === "bttv"),
                itb_ffzemotes: emotes.filter(e => e.provider === "ffz"),
                itb_ttvemotes: emotes.filter(e => e.provider === "ttv"),
                ttv: ttvdata
            });
        });

        App.get("/me", (req, res) => {
            res.render("pages/home", {
                botn: "fembajbot"
            });
        });

        App.use(express.static(`${__dirname}/static`));
        if (opts.debug) {
            http.createServer(App).listen(8080, () => {
                log.debug("The bot web server is running on port", "8080");
            });
        } else {
            var credentials = {
                key: readFileSync(cfg.Web.Private, {encoding: "utf-8"}),
                cert: readFileSync(cfg.Web.Certificate, {encoding: "utf-8"}),
                ca: readFileSync(cfg.Web.Chain, {encoding: "utf-8"})
            };

            http.createServer(App).listen(80, () => {
                log.debug("The bot's web HTTP server is running on port", "80");
            });
            
            https.createServer(credentials, App).listen(443, () => {
                log.debug( "The bot's web HTTPS server is running on port", "443");
            });
        }
    } catch (err) {
        log.error(err);
    }
}

export default ServerInit;