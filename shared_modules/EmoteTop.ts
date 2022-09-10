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

type TopModes = "desc" | "asc";

ModuleManager.registerParent("etop", 10000, AccessLevels.USER, async (args) => {
    const target: Target | null = await args.Services.DB.target.findFirst({
        where: {alias_id: parseInt(args.Target.ID)}
    });

    if (!target) return Promise.reject("Target with ID " + args.Target.ID + " not found!");

    var mode: TopModes = "desc";
    var show_emotes: number = 10;

    const show_emotes_option: [string, string | boolean] | undefined = args.Message.option.find(o => o[0] === "-s");
    const mode_option: [string, string | boolean] | undefined = args.Message.option.find(o => o[0] === "-m");

    if (mode_option) {
        switch (mode_option[1]) {
            case "desc": {
                mode = "desc";
                break;
            }
            case "asc": {
                mode = "asc";
                break;
            }
            default: {
                mode = "desc";
                break;
            }
        }
    }

    if (show_emotes_option) {
        var _show_emotes: number = parseInt(show_emotes_option[1].toString());
        if (isNaN(_show_emotes)) return Promise.resolve(
            await args.Services.Locale.parsedText("msg.wrong_option", args, [
                "-s",
                "[1-15]"
            ])
        );
        if (_show_emotes > 15) {
            return Promise.resolve(await args.Services.Locale.parsedText("cmd.etop.limit_reached", args, [
                15,
                args.Target.ID
            ]));
        }
        show_emotes = _show_emotes;
    }

    const emotes: Emotes[] | null = await args.Services.DB.emotes.findMany({
        where: {
            provider: "stv",
            targetId: target.id
        },
        orderBy: {
            used_times: mode
        }
    });

    if (!emotes) return Promise.reject("No 7TV emotes found for ID " + target.id);

    if (show_emotes > emotes.length) {
        show_emotes = emotes.length;
    }

    var text: string = ``;

    for (var i = 0; i < show_emotes; i++) {
        text = text + `${emotes[i].name} ${(emotes[i].is_deleted) ? "*" : ""} (${emotes[i].used_times}), `
    }

    return Promise.resolve(await args.Services.Locale.parsedText("cmd.etop.response", args, [
        show_emotes.toString(),
        "7TV",
        await args.Services.Locale.parsedText(
            (mode == "desc") ? "mode.descending" : "mode.ascending",
            args
        ),
        text
    ]));
});

ModuleManager.registerChild("etop", "bttv", async (args) => {
    const target: Target | null = await args.Services.DB.target.findFirst({
        where: {alias_id: parseInt(args.Target.ID)}
    });

    if (!target) return Promise.reject("Target with ID " + args.Target.ID + " not found!");

    var mode: TopModes = "desc";
    var show_emotes: number = 10;

    const show_emotes_option: [string, string | boolean] | undefined = args.Message.option.find(o => o[0] === "-s");
    const mode_option: [string, string | boolean] | undefined = args.Message.option.find(o => o[0] === "-m");

    if (mode_option) {
        switch (mode_option[1]) {
            case "desc": {
                mode = "desc";
                break;
            }
            case "asc": {
                mode = "asc";
                break;
            }
            default: {
                mode = "desc";
                break;
            }
        }
    }

    if (show_emotes_option) {
        var _show_emotes: number = parseInt(show_emotes_option[1].toString());
        if (isNaN(_show_emotes)) return Promise.resolve(
            await args.Services.Locale.parsedText("msg.wrong_option", args, [
                "-s",
                "[1-15]"
            ])
        );
        if (_show_emotes > 15) {
            return Promise.resolve(await args.Services.Locale.parsedText("cmd.etop.limit_reached", args, [
                15,
                args.Target.ID
            ]));
        }
        show_emotes = _show_emotes;
    }

    const emotes: Emotes[] | null = await args.Services.DB.emotes.findMany({
        where: {
            provider: "bttv",
            targetId: target.id
        },
        orderBy: {
            used_times: mode
        }
    });

    if (!emotes) return Promise.reject("No BTTV emotes found for ID " + target.id);

    if (show_emotes > emotes.length) {
        show_emotes = emotes.length;
    }

    var text: string = ``;

    for (var i = 0; i < show_emotes; i++) {
        text = text + `${emotes[i].name} ${(emotes[i].is_deleted) ? "*" : ""} (${emotes[i].used_times}), `
    }

    return Promise.resolve(await args.Services.Locale.parsedText("cmd.etop.response", args, [
        show_emotes.toString(),
        "BTTV",
        await args.Services.Locale.parsedText(
            (mode == "desc") ? "mode.descending" : "mode.ascending",
            args
        ),
        text
    ]));
});

ModuleManager.registerChild("etop", "ffz", async (args) => {
    const target: Target | null = await args.Services.DB.target.findFirst({
        where: {alias_id: parseInt(args.Target.ID)}
    });

    if (!target) return Promise.reject("Target with ID " + args.Target.ID + " not found!");

    var mode: TopModes = "desc";
    var show_emotes: number = 10;

    const show_emotes_option: [string, string | boolean] | undefined = args.Message.option.find(o => o[0] === "-s");
    const mode_option: [string, string | boolean] | undefined = args.Message.option.find(o => o[0] === "-m");

    if (mode_option) {
        switch (mode_option[1]) {
            case "desc": {
                mode = "desc";
                break;
            }
            case "asc": {
                mode = "asc";
                break;
            }
            default: {
                mode = "desc";
                break;
            }
        }
    }

    if (show_emotes_option) {
        var _show_emotes: number = parseInt(show_emotes_option[1].toString());
        if (isNaN(_show_emotes)) return Promise.resolve(
            await args.Services.Locale.parsedText("msg.wrong_option", args, [
                "-s",
                "[1-15]"
            ])
        );
        if (_show_emotes > 15) {
            return Promise.resolve(await args.Services.Locale.parsedText("cmd.etop.limit_reached", args, [
                15,
                args.Target.ID
            ]));
        }
        show_emotes = _show_emotes;
    }

    const emotes: Emotes[] | null = await args.Services.DB.emotes.findMany({
        where: {
            provider: "ffz",
            targetId: target.id
        },
        orderBy: {
            used_times: mode
        }
    });

    if (!emotes) return Promise.reject("No FFZ emotes found for ID " + target.id);

    if (show_emotes > emotes.length) {
        show_emotes = emotes.length;
    }

    var text: string = ``;

    for (var i = 0; i < show_emotes; i++) {
        text = text + `${emotes[i].name} ${(emotes[i].is_deleted) ? "*" : ""} (${emotes[i].used_times}), `
    }

    return Promise.resolve(await args.Services.Locale.parsedText("cmd.etop.response", args, [
        show_emotes.toString(),
        "FFZ",
        await args.Services.Locale.parsedText(
            (mode == "desc") ? "mode.descending" : "mode.ascending",
            args
        ),
        text
    ]));
});

ModuleManager.registerChild("etop", "twitch", async (args) => {
    const target: Target | null = await args.Services.DB.target.findFirst({
        where: {alias_id: parseInt(args.Target.ID)}
    });

    if (!target) return Promise.reject("Target with ID " + args.Target.ID + " not found!");

    var mode: TopModes = "desc";
    var show_emotes: number = 10;

    const show_emotes_option: [string, string | boolean] | undefined = args.Message.option.find(o => o[0] === "-s");
    const mode_option: [string, string | boolean] | undefined = args.Message.option.find(o => o[0] === "-m");

    if (mode_option) {
        switch (mode_option[1]) {
            case "desc": {
                mode = "desc";
                break;
            }
            case "asc": {
                mode = "asc";
                break;
            }
            default: {
                mode = "desc";
                break;
            }
        }
    }

    if (show_emotes_option) {
        var _show_emotes: number = parseInt(show_emotes_option[1].toString());
        if (isNaN(_show_emotes)) return Promise.resolve(
            await args.Services.Locale.parsedText("msg.wrong_option", args, [
                "-s",
                "[1-15]"
            ])
        );
        if (_show_emotes > 15) {
            return Promise.resolve(await args.Services.Locale.parsedText("cmd.etop.limit_reached", args, [
                15,
                args.Target.ID
            ]));
        }
        show_emotes = _show_emotes;
    }

    const emotes: Emotes[] | null = await args.Services.DB.emotes.findMany({
        where: {
            provider: "ttv",
            targetId: target.id
        },
        orderBy: {
            used_times: mode
        }
    });

    if (!emotes) return Promise.reject("No Twitch emotes found for ID " + target.id);

    if (show_emotes > emotes.length) {
        show_emotes = emotes.length;
    }

    var text: string = ``;

    for (var i = 0; i < show_emotes; i++) {
        text = text + `${emotes[i].name} ${(emotes[i].is_deleted) ? "*" : ""} (${emotes[i].used_times}), `
    }

    return Promise.resolve(await args.Services.Locale.parsedText("cmd.etop.response", args, [
        show_emotes.toString(),
        "Twitch",
        await args.Services.Locale.parsedText(
            (mode == "desc") ? "mode.descending" : "mode.ascending",
            args
        ),
        text
    ]));
});