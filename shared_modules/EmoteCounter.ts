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

import { Emotes, Target } from "@prisma/client";
import { AccessLevels, ModuleManager } from "../apollo/utils/modules/ModuleManager";

ModuleManager.registerParent("ecount", 5000, AccessLevels.USER, async (args) => {
    const emote: string = args.Message.filtered_msg.split(' ')[0]

    const target: Target | null = await args.Services.DB.target.findFirst({
        where: {alias_id: parseInt(args.Target.ID)}
    });

    if (!target) return Promise.reject("No target with ID " + args.Target.ID + " registered in my database!");

    const stv_emote: Emotes | null = await args.Services.DB.emotes.findFirst({
        where: {
            name: emote,
            targetId: target.id,
            provider: "stv"
        }
    });

    const bttv_emote: Emotes | null = await args.Services.DB.emotes.findFirst({
        where: {
            name: emote,
            targetId: target.id,
            provider: "bttv"
        }
    });

    const ffz_emote: Emotes | null = await args.Services.DB.emotes.findFirst({
        where: {
            name: emote,
            targetId: target.id,
            provider: "ffz"
        }
    });

    const ttv_emote: Emotes | null = await args.Services.DB.emotes.findFirst({
        where: {
            name: emote,
            targetId: target.id,
            provider: "ttv"
        }
    });

    if (stv_emote) {
        return Promise.resolve(await args.Services.Locale.parsedText("cmd.ecount.response", args, [
            "[7TV]",
            emote,
            stv_emote.used_times
        ]));
    }
    if (bttv_emote) {
        return Promise.resolve(await args.Services.Locale.parsedText("cmd.ecount.response", args, [
            "[BTTV]",
            emote,
            bttv_emote.used_times
        ]));
    }
    if (ffz_emote) {
        return Promise.resolve(await args.Services.Locale.parsedText("cmd.ecount.response", args, [
            "[FFZ]",
            emote,
            ffz_emote.used_times
        ]));
    }
    if (ttv_emote) {
        return Promise.resolve(await args.Services.Locale.parsedText("cmd.ecount.response", args, [
            "[Twitch]",
            emote,
            ttv_emote.used_times
        ]));
    }
    return Promise.resolve(await args.Services.Locale.parsedText("cmd.ecount.not_found", args, [
        "",
        emote
    ]));
});