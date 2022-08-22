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

import { Router } from "express";
import IConfiguration from "../../apollo/interfaces/IConfiguration";
import crypto from "crypto";
import bodyParser from "body-parser";

export default function ApiRoute(cfg: IConfiguration): Router {
    const router = Router();

    router.use(bodyParser.json());

    router.post("/gh/webhook", (req, res) => {
        const h_key: string | string[] | undefined = req.headers["x-hub-signature-256"];
        const a_key: string = cfg.Keys.GHWebhook;
        var body: string = "";

        req.on("readable", () => {
            body += req.read();
        });
        req.on("end", () => {
            console.log(body);
        });

        console.log(body);

        const hash: string = "sha256=" + crypto.createHmac("sha256", a_key).update(JSON.stringify(body)).digest("hex");

        if (h_key !== hash) {
            return res.json([
                {
                    status: 401,
                    message: "Unauthorized"
                }
            ]).status(401);
        }

        const action: string | string[] | undefined = req.headers["x-github-event"];

        if (typeof action == "string") {
            switch (action) {
                case "push": {
                    console.log(action)
                    console.log(req.body)
                    break;
                }
                default: {
                    break;
                }
            }
        }


        return res.send(req);
    });

    return router;
}