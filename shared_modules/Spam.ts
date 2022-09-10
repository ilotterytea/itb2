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

import { AccessLevels, ModuleManager } from "../apollo/utils/modules/ModuleManager";

ModuleManager.registerParent("spam", 32767, AccessLevels.MOD, async (args) => {
    var _msg: string[] = args.Message.filtered_msg.split(' ');
    const count: number = parseInt(_msg[0]);
    const max_count: number = 32;
    const commandRegex: RegExp = /^(!|#|\$|%|\^|&|\*|\(|\)|-|=|\+|\\|\/|:|"|'|\[|\]|\||<|>|\?|\.)/;


    if (isNaN(count)) return Promise.resolve(await args.Services.Locale.parsedText("cmd.spam.unresolved_number", args, [
        _msg[0]
    ]));

    if (count > max_count) return Promise.resolve(await args.Services.Locale.parsedText("cmd.spam.limit_reached", args, [
        max_count
    ]));

    if (commandRegex.test(_msg.join(' ').trim())) return Promise.resolve(await args.Services.Locale.parsedText("cmd.spam.forbidden_symbol", args));

    delete _msg[0];

    for (var i = 0; i < count; i++) {
        args.Services.Client.say(`#${args.Target.Username}`, _msg.join(' ').trim());
    }

    return Promise.resolve("");
});