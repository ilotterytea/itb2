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

import { Chain, PrismaClient } from "@prisma/client";
import { ChatUserstate, Client } from "tmi.js";
import { Token, Tokenize } from "../fun/markov/Tokenize";

async function AnonMessageHandler(
    client: Client,
    db: PrismaClient
) {
    client.on("message", async (channel: string, user: ChatUserstate, msg: string, self: boolean) => {
        const regex: RegExp = /[~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/;

        // Tokenize message:
        setTimeout(async () => {
            // Filter the message from special characters:
            for (const letter of msg) {
                if (regex.test(letter)) {
                    msg = msg.replace(letter, "");
                }
            }

            const _tokens: Token[] = Tokenize(msg);

            for await (const token of _tokens) {
                const _token: Chain | null = await db.chain.findFirst({
                    where: {
                        fromWord: token.fromWord
                    }
                });

                if (!_token) {
                    await db.chain.create({data: {
                        fromWord: token.fromWord,
                        toWord: token.toWord
                    }});
                } else {
                    await db.chain.update({
                        where: {id: _token.id},
                        data: {
                            toWord: token.toWord
                        }
                    });
                }
            }
        }, 2500);

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