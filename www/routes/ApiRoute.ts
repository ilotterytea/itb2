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
    router.use(bodyParser.urlencoded({extended: true}));

    router.post("/gh/webhook", (req, res) => {
        console.log(req.body);
        console.log(req.headers["x-hub-signature-256"]);
        console.log("sha256=" + crypto.createHmac("sha256", cfg.Keys.GHWebhook).update(JSON.stringify(req.body)).digest("hex"))
        res.status(401).json({});
    });

    return router;
}