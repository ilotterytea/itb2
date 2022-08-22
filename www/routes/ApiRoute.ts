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

export default function ApiRoute(cfg: IConfiguration): Router {
    const router = Router();

    router.use(bodyParser.json());
    console.log(cfg);
    router.use(bodyParser.urlencoded({extended: true}));

    function verifyPayload(req: Request, res: Response, next: NextFunction): void {
        if (!req.body) {
            return next("Request Body is empty!");
        }
        const data = JSON.stringify(req.body);
        const signature = Buffer.from(req.get("x-hub-signature-256") || "", "utf-8");
        const hmac = crypto.createHmac("sha256", cfg.Keys.GHWebhook);
        const digest = Buffer.from(`sha256=${hmac.update(data).digest("hex")}`, "utf-8");

        if (signature.length !== digest.length || !crypto.timingSafeEqual(digest, signature)) {
            return next("Request body digest " + digest + " didn't match x-hub-signature-256 " + signature);
        }
        return next();
    }

    router.post("/gh/webhook", verifyPayload, (req, res) => {
        console.log(JSON.parse(req.body.payload));
        res.status(200).send("Request is signed!");
    });

    return router;
}