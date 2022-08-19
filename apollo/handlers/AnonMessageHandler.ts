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

import { PrismaClient } from "@prisma/client";
import { ChatUserstate, Client } from "tmi.js";

async function AnonMessageHandler(
    client: Client,
    db: PrismaClient
) {
    client.on("message", async (channel: string, user: ChatUserstate, msg: string, self: boolean) => {
        await db.log.create({
            data: {
                alias_id: parseInt(user["user-id"]!),
                channel_id: parseInt(user["room-id"]!),
                event: "MSG",
                message: msg
            }
        });
    });
}

export {AnonMessageHandler};