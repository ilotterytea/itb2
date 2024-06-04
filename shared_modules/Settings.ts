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

import { Target } from "@prisma/client";
import { AccessLevels, ModuleManager } from "../apollo/utils/modules/ModuleManager";

ModuleManager.registerParent("set", 12500, AccessLevels.BROADCASTER, async (args) => {
    return Promise.resolve("");
});

ModuleManager.registerChild("set", "lang", async (args) => {
    const target: Target | null = await args.Services.DB.target.findFirst({
        where: {alias_id: parseInt(args.Target.ID)}
    });

    if (!target) return Promise.reject("");

    if (!args.Message.filtered_msg) {
        return Promise.resolve(await args.Services.Locale.parsedText("cmd.set.language.available", args));
    }

    if (args.Services.Locale.getLanguages === undefined) {
        return Promise.reject("Any languages aren't available.");
    }

    if (!(args.Message.filtered_msg in args.Services.Locale.getLanguages)) {
        return Promise.resolve(await args.Services.Locale.parsedText("cmd.set.language.not_found", args, [args.Message.filtered_msg]));
    }

    await args.Services.DB.target.update({
        where: {id: target.id},
        data: {
            language_id: args.Message.filtered_msg
        }
    });

    return Promise.resolve(await args.Services.Locale.parsedText("cmd.set.language.success", args));
});

ModuleManager.registerChild("set", "prefix", async (args) => {
    const target: Target | null = await args.Services.DB.target.findFirst({
        where: {alias_id: parseInt(args.Target.ID)}
    });

    if (!target) return Promise.reject("");
    if (args.Message.filtered_msg.length == 0) return Promise.resolve(await args.Services.Locale.parsedText("msg.wrong_option", args, ["prefix", "[STRING]"]));

    await args.Services.DB.target.update({
        where: {id: target.id},
        data: {
            prefix: args.Message.filtered_msg
        }
    });

    return Promise.resolve(await args.Services.Locale.parsedText("cmd.set.prefix.success", args, [
        args.Message.filtered_msg
    ]));
});