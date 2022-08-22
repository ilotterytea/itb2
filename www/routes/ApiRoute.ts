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

export default function ApiRoute(cfg: IConfiguration): Router {
    const router = Router();

    router.post("/gh/webhook", (req, res) => {
        console.log(req.headers["X-Hub-Signature-256"]);/*
        if (!req.headers["X-Hub-Signature-256"] ||
        req.headers["X-Hub-Signature-256"] !== crypto.createHash("sha256").update(cfg.Keys.GHWebhook).digest("hex")) {
            return res.json([
                {
                    status: 401,
                    message: "Unauthorized"
                }
            ]).status(401);
        }*/

        return res.json(req.body);
    });

    return router;
}