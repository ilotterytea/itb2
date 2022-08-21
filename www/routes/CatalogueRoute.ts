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

import { PrismaClient, Target } from "@prisma/client";
import { Router } from "express";
import TwitchApi from "../../apollo/clients/ApiClient";
import IConfiguration from "../../apollo/interfaces/IConfiguration";

export default function CatalogueRoute(prisma: PrismaClient, ttvapi: TwitchApi.Client, cfg: IConfiguration): Router {
    const router = Router();

    router.get("/", async (req, res) => {
        var channels: Target[] | null = await prisma.target.findMany({
            where: {
                NOT: {
                    id: -72
                }
            }
        });

        var users: any[] = [];

        if (!channels) {
            return res.render("pages/error", {
                status: 500,
                message: "Something went wrong.",
                kitty: "https://http.cat/500"
            });
        }

        for await (const channel of channels) {
            const user = await ttvapi.getUserById(channel.alias_id);
            if (!user) return;
            users.push(user);
        }

        res.render("pages/catalogue", {
            users: users,
            itb2: channels,
            bot_name: cfg.Authorization.Username
        });
    });

    return router;
}