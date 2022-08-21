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

import { Emotes, PrismaClient, Target } from "@prisma/client";
import { Router } from "express";
import TwitchApi from "../../apollo/clients/ApiClient";

export default function ChannelRoute(prisma: PrismaClient, ttvapi: TwitchApi.Client): Router {
    const router = Router();

    router.get("/", async (req, res) => {
        return res.redirect("/catalogue");
    });

    router.get("/:id", async (req, res) => {
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

    return router;
}