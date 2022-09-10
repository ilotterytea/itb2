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

import axios from "axios";
import { AccessLevels, ModuleManager } from "../apollo/utils/modules/ModuleManager";

ModuleManager.registerParent("user", 10000, AccessLevels.USER, async (args) => {
    const name: string = args.Message.filtered_msg.split(' ')[0];
    const response = await axios.get("https://api.ivr.fi/twitch/resolve/" + name, {responseType: "json"});
    const data = response.data;

    if (response.status != 200) return Promise.resolve(await args.Services.Locale.parsedText("msg.api_error", args, [
        response.status
    ]));

    if (args.Message.option.find(o => o[0] === "--pfp")) {
        return Promise.resolve(await args.Services.Locale.parsedText("cmd.user.picture", args, [
            data.login,
            data.id,
            data.logo
        ]));
    }

    if (args.Message.option.find(o => o[0] === "--rules")) {
        return Promise.resolve(await args.Services.Locale.parsedText("cmd.user.rules", args, [
            data.login,
            data.id,
            data.chatSettings.rules.join(', ')
        ]));
    }

    return Promise.resolve(await args.Services.Locale.parsedText("cmd.user.lookup", args, [
        data.displayName,
        data.login,
        data.id,
        data.bio,
        data.chatColor,
        (data.partner) ? "✅" : "⛔",
        (data.affiliate) ? "✅" : "⛔",
        (data.bot) ? "✅" : "⛔",
        (data.banned) ? "✅" : "⛔"
    ]));
}, ["--pfp", "--rules"]);