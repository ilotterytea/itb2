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
import { readFileSync } from "fs";
import IConfiguration from "../../apollo/interfaces/IConfiguration";

export default function CommandsRoute(cfg: IConfiguration): Router {
    const router = Router();

    router.get("/", (req, res) => {
        const cmds: Record<string, any> = JSON.parse(
            readFileSync("www/static/metadata/cmds.json", {
                encoding: "utf-8"
            })
        );

        return res.render("pages/commands", {
            cmds: cmds
        });
    });

    router.get("/:id", (req, res) => {
        const cmds: Record<string, any> = JSON.parse(
            readFileSync("www/static/metadata/cmds.json", {
                encoding: "utf-8"
            })
        );

        if (!(req.params.id in cmds)) {
            return res.render("pages/error", {
                status: 404,
                message: "The command with ID " + req.params.id + "not found!",
                kitty: "https://http.cat/404"
            });
        }

        return res.render("pages/commandpage", {
            cmd: cmds[req.params.id],
            cmds: cmds,
            bot_name: cfg.Authorization.Username
        });
    });

    return router;
}