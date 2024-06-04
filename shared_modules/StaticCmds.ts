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

import { CustomResponses, Target } from "@prisma/client";
import { AccessLevels, ModuleManager } from "../apollo/utils/modules/ModuleManager";

ModuleManager.registerParent("cmd", 5000, AccessLevels.BROADCASTER, async (args) => {
    return Promise.resolve("");
});

ModuleManager.registerChild("cmd", "create", async (args) => {
    const target: Target | null = await args.Services.DB.target.findFirst({
        where: {alias_id: parseInt(args.Target.ID)}
    });

    if (!target) return Promise.reject("No target ID " + args.Target.ID);
    
    const name: string = args.Message.filtered_msg.split(' ')[0];

    const cmd: CustomResponses | null = await args.Services.DB.customResponses.findFirst({
        where: {
            id: name,
            targetId: target.id
        }
    });

    if (cmd) {
        return Promise.resolve(await args.Services.Locale.parsedText("staticcmd.already_exists", args, [
            name
        ]));
    }

    await args.Services.DB.customResponses.create({
        data: {
            id: name,
            response: args.Message.filtered_msg.slice(name.length + 1, args.Message.filtered_msg.length),
            value: true,
            targetId: target.id
        }
    });

    return Promise.resolve(await args.Services.Locale.parsedText("staticcmd.new", args, [
            name,
            args.Target.Username
    ]));
});

ModuleManager.registerChild("cmd", "delete", async (args) => {
    const target: Target | null = await args.Services.DB.target.findFirst({
        where: {alias_id: parseInt(args.Target.ID)}
    });

    if (!target) return Promise.reject("No target ID " + args.Target.ID);
    
    const name: string = args.Message.filtered_msg.split(' ')[0];

    const cmd: CustomResponses | null = await args.Services.DB.customResponses.findFirst({
        where: {
            id: name,
            targetId: target.id
        }
    });

    if (!cmd) {
        return Promise.resolve(await args.Services.Locale.parsedText("staticcmd.not_exists", args, [
            name
        ]));
    }

    await args.Services.DB.customResponses.delete({
        where: {int_id: cmd.int_id}
    });

    return Promise.resolve(await args.Services.Locale.parsedText("staticcmd.remove", args, [
            name,
            args.Target.Username
    ]));
});

ModuleManager.registerChild("cmd", "edit", async (args) => {
    const target: Target | null = await args.Services.DB.target.findFirst({
        where: {alias_id: parseInt(args.Target.ID)}
    });

    if (!target) return Promise.reject("No target ID " + args.Target.ID);
    
    const name: string = args.Message.filtered_msg.split(' ')[0];

    const cmd: CustomResponses | null = await args.Services.DB.customResponses.findFirst({
        where: {
            id: name,
            targetId: target.id
        }
    });

    if (!cmd) {
        return Promise.resolve(await args.Services.Locale.parsedText("staticcmd.already_exists", args, [
            name
        ]));
    }

    await args.Services.DB.customResponses.update({
        where: {int_id: cmd.int_id},
        data: {
            response: args.Message.filtered_msg.slice(name.length + 1, args.Message.filtered_msg.length)
        }
    });

    return Promise.resolve(await args.Services.Locale.parsedText("staticcmd.editline", args, [
            1,
            name
    ]));
});

ModuleManager.registerChild("cmd", "enable", async (args) => {
    const target: Target | null = await args.Services.DB.target.findFirst({
        where: {alias_id: parseInt(args.Target.ID)}
    });

    if (!target) return Promise.reject("No target ID " + args.Target.ID);
    
    const name: string = args.Message.filtered_msg.split(' ')[0];

    const cmd: CustomResponses | null = await args.Services.DB.customResponses.findFirst({
        where: {
            id: name,
            targetId: target.id
        }
    });

    if (!cmd) {
        return Promise.resolve(await args.Services.Locale.parsedText("staticcmd.already_exists", args, [
            name
        ]));
    }

    await args.Services.DB.customResponses.update({
        where: {int_id: cmd.int_id},
        data: {
            value: true
        }
    });

    return Promise.resolve(await args.Services.Locale.parsedText("staticcmd.enable", args, [
            name
    ]));
});

ModuleManager.registerChild("cmd", "disable", async (args) => {
    const target: Target | null = await args.Services.DB.target.findFirst({
        where: {alias_id: parseInt(args.Target.ID)}
    });

    if (!target) return Promise.reject("No target ID " + args.Target.ID);
    
    const name: string = args.Message.filtered_msg.split(' ')[0];

    const cmd: CustomResponses | null = await args.Services.DB.customResponses.findFirst({
        where: {
            id: name,
            targetId: target.id
        }
    });

    if (!cmd) {
        return Promise.resolve(await args.Services.Locale.parsedText("staticcmd.already_exists", args, [
            name
        ]));
    }

    await args.Services.DB.customResponses.update({
        where: {int_id: cmd.int_id},
        data: {
            value: false
        }
    });

    return Promise.resolve(await args.Services.Locale.parsedText("staticcmd.enable", args, [
            name
    ]));
});