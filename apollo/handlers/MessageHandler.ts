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

import { Chain, CustomResponses, Target, User } from "@prisma/client";
import {
    ChatUserstate,
    Client
} from "tmi.js";
import { Logger } from "tslog";
import IArguments from "../interfaces/IArguments";
import IServices from "../interfaces/IServices";
import CommandFormatter from "../utils/commands/CommandFormatter";
import { ModuleManager, AccessLevels } from "../utils/modules/ModuleManager";

import "../../shared_modules/ImportedModules";

const log: Logger = new Logger({name: "Messages"});

namespace Messages {
    /**
     * Twitch TMI message handler.
     * @param Services services.
     */
    export async function Handler(Services: IServices) {
        Services.Client.on("message", async (channel: string, user: ChatUserstate, message: string, self: boolean) => {
            if (self) return;

            // Command prefix:
            const targetDb: Target | null = await Services.DB.target.findFirst({
                where: {
                    alias_id: parseInt(user["room-id"]!)
                }
            });

            const userDb: User | null = await Services.DB.user.findFirst({
                where: {alias_id: parseInt(user["user-id"]!)}
            });

            const globalTarget: Target | null = await Services.DB.target.findFirst({
                where: {id: -72, alias_id: -71}
            });

            // Don't continue processing the code if sender is suspended from the bot:
            if (userDb !== null && userDb.int_role !== null && userDb.int_role == -1) return;

            if (!globalTarget) {
                log.warn("Global target (ID -72) not found! Creating...");
                await Services.DB.target.create({
                    data: {
                        id: -72,
                        alias_id: -71,
                        chat_lines: 0,
                        exec_cmds: 0,
                        tests: 0,
                        language_id: "en_us",
                        prefix: "!"
                    }
                });
                return;
            }

            if (!targetDb) {
                log.warn("Target with ID", user["room-id"]!, "not found in database! Creating a new one...");
                await Services.DB.target.create({
                    data: {
                        alias_id: parseInt(user["room-id"]!)
                    }
                });
                if (Services.Emote) {
                    await Services.Emote.syncAllEmotes(user["room-id"]!);
                }
                await Services.Symlinks.register(user["room-id"]!);
                return;
            }

            const prefix: string = (targetDb.prefix) ? targetDb.prefix : (globalTarget.prefix) ? globalTarget.prefix : "!";
            const markov_regex: RegExp = new RegExp(/^((@)?imteabot(,)?).*/i);

            // Arguments:
            var args: IArguments = {
                Services: Services,
                Sender: {
                    Username: user.username!,
                    ID: user["user-id"]!,
                    Role: AccessLevels.USER
                },
                Target: {
                    Username: channel.slice(1, channel.length),
                    ID: user["room-id"]!
                },
                Message: {
                    raw: message,
                    run_ts: CommandFormatter.parseCommand(message, prefix),
                    command: CommandFormatter.parseCommand(message, prefix, true),
                    option: CommandFormatter.parseOptions(message),
                    filtered_msg: CommandFormatter.parseMessage(message, CommandFormatter.parseCommand(message, prefix) + " " + CommandFormatter.parseCommand(message, prefix, true), CommandFormatter.parseOptions(message))
                }
            }

            // Assigning the roles:
            if (userDb !== null && userDb.int_role !== null) {
                args.Sender.Role = userDb.int_role;
            } else {
                if (args.Target.ID === args.Sender.ID) args.Sender.Role = AccessLevels.BROADCASTER;
                if (user["badges"]?.moderator === "1") args.Sender.Role = AccessLevels.MOD;
                if (user["badges"]?.vip === "1") args.Sender.Role = AccessLevels.VIP;
            }

            // +1 chat line to the target's file:
            await Services.DB.target.update({
                where: {id: targetDb.id},
                data: {
                    chat_lines: (targetDb.chat_lines === null) ? 1 : targetDb.chat_lines + 1
                }
            });

            // +1 used times to the emote:
            if (Services.Emote !== undefined) await Services.Emote.increaseEmoteCount(args.Message.raw, args.Target.ID);

            // Complete a test:
            if (message == "test") {
                await Services.DB.target.update({
                    where: {id: targetDb.id},
                    data: {
                        tests: (targetDb.tests === null) ? 1 : targetDb.tests + 1
                    }
                });

                Services.Client.say(
                    `#${args.Target.Username}`,
                    await Services.Locale.parsedText("msg.test", args, [
                        "test",
                        targetDb.tests
                    ])
                );
            }

            // Call the markov:
            if (markov_regex.test(args.Message.raw)) {
                const _message: string[] = args.Message.raw.replace(/^((@)?imteabot(,)?)/i, "").trim().split(' ');
                var chain_message: string = "";
                console.log(_message);

                for (const word of _message) {
                    console.log(word);
                    const first_chain: Chain | null = await Services.DB.chain.findFirst({
                        where: {
                            fromWord: word,
                            AND: {
                                NOT: {
                                    toWord: "\x03"
                                }
                            }
                        }
                    });

                    console.log(first_chain);
                    if (!first_chain) continue;

                    var next_chain: Chain | null = null;

                    while (true) {
                        var chain: Chain | null = null;
                        if (!next_chain) {
                            chain_message = chain_message + first_chain.fromWord + " ";

                            chain = await Services.DB.chain.findFirst({
                                where: {
                                    fromWord: first_chain.toWord
                                }
                            });
                            console.log(chain);

                            if (!chain) break;
                            next_chain = chain;
                        } else {
                            chain_message = chain_message + next_chain.fromWord + " ";

                            chain = await Services.DB.chain.findFirst({
                                where: {
                                    fromWord: next_chain.toWord
                                }
                            });
                            console.log(chain);

                            if (!chain) break;
                            next_chain = chain;
                        }
                    }
                }

                Services.Client.say(channel, chain_message);
                return;
            }

            // Start processing the commands:
            if (args.Message.run_ts) {
                if (ModuleManager.contains(args.Message.run_ts)) {
                    const response: string = await ModuleManager.run(args.Message.run_ts, args);

                    Services.Client.say(`#${args.Target.Username}`, response);
                }
                return;
            }
            
            await StaticCommandHandler(args);
        });

        process.once("SIGHUP", async () => {
            await Services.Client.disconnect();
        });

        setInterval(async () => {
            if (Services.Emote === undefined) return;

            for (const target of await Services.DB.target.findMany()) {
                await Services.Emote.syncAllEmotes(target.alias_id.toString());
            }
        }, 30000);
        if (Services.Timer !== undefined) Services.Timer.tick(Services.Client);
        if (Services.Emote) await Services.Emote.subscribeTo7TVEventAPI();
    }

    async function StaticCommandHandler(args: IArguments) {
        var target: Target | null = await args.Services.DB.target.findFirst({
            where: {alias_id: parseInt(args.Target.ID)}
        });

        if (target === null) return;

        const cmd_a: CustomResponses | null = await args.Services.DB.customResponses.findFirst({
            where: {
                id: `@usernameequals(${args.Sender.Username.toLowerCase()})`,
                targetId: target.id
            }
        });

        if (cmd_a && cmd_a.value) {
            args.Services.Client.say(`#${args.Target.Username}`, args.Services.Locale.customParsedText(cmd_a.response, args));
            return;
        }

        const cmd: CustomResponses | null = await args.Services.DB.customResponses.findFirst({
            where: {
                id: args.Message.raw.split(' ')[0],
                targetId: target.id
            }
        });

        if (cmd === null) return;
        if (cmd.value == false) return;
        
        args.Services.Client.say(`#${args.Target.Username}`, args.Services.Locale.customParsedText(cmd.response, args));
    }
}

export default Messages;