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

import { NextFunction, Router, Request, Response } from "express";
import IConfiguration from "../../apollo/interfaces/IConfiguration";
import crypto from "crypto";
import bodyParser from "body-parser";
import { Logger } from "tslog";
import { Client } from "tmi.js";
import Localizator from "../../apollo/utils/Locale";

const log: Logger = new Logger({name: "apirouter"});

export default function ApiRoute(client: Client, locale: Localizator, cfg: IConfiguration): Router {
    const router = Router();

    router.use(bodyParser.json());
    router.use(bodyParser.urlencoded({extended: true}));

    router.post("/gh/webhook", async (req, res) => {
        const req_hash: string | undefined = req.get("x-hub-signature-256");
        const hash: string = "sha256=" + crypto.createHmac("sha256", cfg.Keys.GHWebhook).update(JSON.stringify(req.body)).digest("hex");

        if (req_hash && req_hash !== hash) {
            return res.status(401).json([
                {
                    status: 401,
                    message: "Unauthorized"
                }
            ]);
        }

        const action: string | undefined = req.get("x-github-event");
        const channel: string = "#ilotterytea";
        const payload: {[key: string]: any} = req.body;

        switch (action) {
            case "push": {
                for (const commit of payload.commits) {
                    client.say(channel, await locale.parsedText("gh.push", undefined, [
                        payload.sender.login,
                        commit.id.slice(0, 7),
                        payload.repository.full_name,
                        commit.message,
                        commit.added.length,
                        commit.removed.length,
                        commit.modified.length
                    ], {target_name: "ilotterytea"}));
                }
                break;
            }
            default: {
                log.warn("Action", action, "wasn't resolved!");
                break;
            }
        }

        return res.status(200).json([
            {
                status: 200,
                message: "Payload was successfully parsed and resolved!"
            }
        ]);
    });

    return router;
}