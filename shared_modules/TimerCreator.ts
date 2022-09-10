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

import { Target, Timers } from "@prisma/client";
import { AccessLevels, ModuleManager } from "../apollo/utils/modules/ModuleManager";

ModuleManager.registerParent("timer", 5000, AccessLevels.BROADCASTER, async (args) => {
    return Promise.resolve("");
});

ModuleManager.registerChild("timer", "create", async (args) => {
    const target: Target | null = await args.Services.DB.target.findFirst({
        where: {alias_id: parseInt(args.Target.ID)}
    });

    if (!target) return Promise.reject("No target ID " + args.Target.ID);

    const name: string = args.Message.filtered_msg.split(' ')[0];
    const interval: number = parseInt(args.Message.filtered_msg.split(' ')[1]) * 1000;

    if (isNaN(interval)) return Promise.resolve(await args.Services.Locale.parsedText("timer.incorrect_interval", args, [name, args.Message.filtered_msg.split(' ')[1]]));

    const timer: Timers | null = await args.Services.DB.timers.findFirst({
        where: {
            id: name,
            targetId: target.id
        }
    });

    if (timer) return Promise.resolve("no");

    await args.Services.DB.timers.create({
        data: {
            id: name,
            targetId: target.id,
            response: args.Message.filtered_msg.slice(name.length + 1 + interval.toString().length + 2, args.Message.filtered_msg.length),
            interval_ms: interval,
            value: true
        }
    });

    if (args.Services.Timer) args.Services.Timer.newTick(
        args.Target.ID,
        name,
        args.Services.Client,
        args.Target.Username,
        args.Message.filtered_msg.slice(name.length + interval.toString().length + 2, args.Message.filtered_msg.length),
        interval
    );

    return Promise.resolve(await args.Services.Locale.parsedText("timer.new", args, [
        name
    ]));
});

ModuleManager.registerChild("timer", "delete", async (args) => {
    const target: Target | null = await args.Services.DB.target.findFirst({
        where: {alias_id: parseInt(args.Target.ID)}
    });

    if (!target) return Promise.reject("No target ID " + args.Target.ID);

    const name: string = args.Message.filtered_msg.split(' ')[0];
    const timer: Timers | null = await args.Services.DB.timers.findFirst({
        where: {
            id: name,
            targetId: target.id
        }
    });

    if (!timer) return Promise.resolve("no");

    await args.Services.DB.timers.delete({
        where: {int_id: timer.int_id}
    });

    if (args.Services.Timer) args.Services.Timer.disposeTick(args.Target.ID, name);

    return Promise.resolve(await args.Services.Locale.parsedText("timer.removed", args, [
        name
    ]));
});

ModuleManager.registerChild("timer", "disable", async (args) => {
    const target: Target | null = await args.Services.DB.target.findFirst({
        where: {alias_id: parseInt(args.Target.ID)}
    });

    if (!target) return Promise.reject("No target ID " + args.Target.ID);

    const name: string = args.Message.filtered_msg.split(' ')[0];

    const timer: Timers | null = await args.Services.DB.timers.findFirst({
        where: {
            id: name,
            targetId: target.id
        }
    });

    if (!timer) return Promise.resolve("no");

    await args.Services.DB.timers.update({
        where: {int_id: timer.int_id},
        data: {
            value: false
        }
    });

    if (args.Services.Timer) args.Services.Timer.disposeTick(
        args.Target.ID,
        name
    );

    return Promise.resolve(await args.Services.Locale.parsedText("timer.disabled", args, [
        name
    ]));
});

ModuleManager.registerChild("timer", "enable", async (args) => {
    const target: Target | null = await args.Services.DB.target.findFirst({
        where: {alias_id: parseInt(args.Target.ID)}
    });

    if (!target) return Promise.reject("No target ID " + args.Target.ID);

    const name: string = args.Message.filtered_msg.split(' ')[0];
    const timer: Timers | null = await args.Services.DB.timers.findFirst({
        where: {
            id: name,
            targetId: target.id
        }
    });

    if (!timer) return Promise.resolve("no");

    await args.Services.DB.timers.update({
        where: {int_id: timer.int_id},
        data: {
            value: true
        }
    });

    if (args.Services.Timer) args.Services.Timer.newTick(
        args.Target.ID,
        name,
        args.Services.Client,
        args.Target.Username,
        timer.response,
        timer.interval_ms
    );

    return Promise.resolve(await args.Services.Locale.parsedText("timer.enabled", args, [
        name
    ]));
});

ModuleManager.registerChild("timer", "info", async (args) => {
    const target: Target | null = await args.Services.DB.target.findFirst({
        where: {alias_id: parseInt(args.Target.ID)}
    });

    if (!target) return Promise.reject("No target ID " + args.Target.ID);

    const name: string = args.Message.filtered_msg.split(' ')[0];

    const timer: Timers | null = await args.Services.DB.timers.findFirst({
        where: {
            id: name,
            targetId: target.id
        }
    });

    if (!timer) return Promise.resolve("no");

    return Promise.resolve(await args.Services.Locale.parsedText("timer.info", args, [
        timer.id,
        timer.value,
        timer.interval_ms,
        1,
        timer.response
    ]));
}, 5000, AccessLevels.USER);

ModuleManager.registerChild("timer", "list", async (args) => {
    const target: Target | null = await args.Services.DB.target.findFirst({
        where: {alias_id: parseInt(args.Target.ID)}
    });

    if (!target) return Promise.reject("No target ID " + args.Target.ID);

    const timer: Timers[] | null = await args.Services.DB.timers.findMany({
        where: {
            targetId: target.id
        }
    });

    if (!timer) return Promise.resolve("no");

    return Promise.resolve(await args.Services.Locale.parsedText("timer.list", args, [
        args.Target.Username,
        args.Target.ID,
        timer.map((value) => {
            return value.id
        }).join(', ')
    ]));
}, 5000, AccessLevels.USER);