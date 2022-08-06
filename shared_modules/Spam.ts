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

import IArguments from "../apollo/interfaces/IArguments";
import IModule from "../apollo/interfaces/IModule";

export default class Spam implements IModule.IModule {
    cooldownMs: number;
    permissions: IModule.AccessLevels;
    minPermissions?: IModule.AccessLevels;

    constructor (cooldownMs: number, perms: IModule.AccessLevels, minperms?: IModule.AccessLevels | undefined) {
        this.cooldownMs = cooldownMs;
        this.permissions = perms;
        this.minPermissions = minperms;
    }

    async run(Arguments: IArguments) {
        var count: number = parseInt(Arguments.Message.raw.split(' ')[1]);

        if (isNaN(count)) {
            return Promise.resolve(Arguments.Services.Locale.parsedText("cmd.spam.unresolved_number", Arguments, [
                Arguments.Message.raw.split(' ')[1]
            ]));
        }

        if (count > 32) {
            return Promise.resolve(Arguments.Services.Locale.parsedText("cmd.spam.limit_reached", Arguments, [
                32
            ]));
        }

        var message: string[] = Arguments.Message.raw.split(' ');

        var useCounter: boolean | undefined = (message.includes("-c") || message.includes("--counter")) ? true : false;

        message = message.filter(m => m !== "-c");
        message = message.filter(m => m !== "--counter");

        var commandRegex: RegExp = /^(!|#|\$|%|\^|&|\*|\(|\)|-|=|\+|\\|\/|:|"|'|\[|\]|\||<|>|\?|\.)/;
        
        delete message[0];
        delete message[1];

        if (commandRegex.test(message.join(' ').trim())) {
            return Promise.resolve(Arguments.Services.Locale.parsedText("cmd.spam.forbidden_symbol", Arguments));
        }

        for (var index = 0; index < count; index++) {
            Arguments.Services.Client.say(Arguments.Target.Username, `${message.join(' ')} ${(useCounter) ? index + 1 : ""}`)
        }

        // 👍:
        return Promise.resolve(true);
    }
}