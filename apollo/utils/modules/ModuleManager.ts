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

import { Logger } from "tslog";
import IArguments from "../../interfaces/IArguments";
import CooldownControl from "./CooldownControl";

const log: Logger = new Logger({name: "ModuleManager"});

enum AccessLevels {
    SUSPENDED = -1,
    USER,
    VIP,
    MOD,
    BROADCASTER,
    SPECIAL = 72,
    SUPAUSER = 99,
    OWNER_USER
}

interface ICommand {
    name: string,
    cooldownMs: number,
    permissions: AccessLevels,
    options: string[],
    main_run: (args: IArguments) => Promise<string>,
}

interface IModule {
    name: string,
    cooldownMs: number,
    permissions: AccessLevels,
    options: string[],
    child_cmds: ICommand[],
    main_run: (args: IArguments) => Promise<string>,
}

class ModuleManager {
    private static _modules: IModule[] = [];

    public static registerParent(
        name: string,
        cooldownMs: number,
        permissions: AccessLevels,
        run: (args: IArguments) => Promise<string>,
        options?: string[]
    ): void {
        if (this._modules.find(m => m.name === name)) return;
        this._modules.push({
            name: name,
            cooldownMs: cooldownMs,
            permissions: permissions,
            child_cmds: [],
            main_run: run,
            options: (options) ? options : []
        });

        log.info("Registered a new module with name", name, " (Cooldown:", cooldownMs, "milliseconds, Min. permissions:", permissions, ")!");
    }

    public static registerChild(
        parentName: string,
        name: string,
        run: (args: IArguments) => Promise<string>,
        cooldownMs?: number | undefined,
        permissions?: AccessLevels | undefined,
        options?: string[]
    ): void {
        var parentMod: IModule | undefined = this._modules.find(m => m.name === parentName);

        if (!parentMod) return;
        if (parentMod.child_cmds.find(c => c.name === name)) return;

        this._modules[this._modules.indexOf(parentMod)].child_cmds.push({
            name: name,
            cooldownMs: (cooldownMs !== undefined) ? cooldownMs : parentMod.cooldownMs,
            permissions: (permissions !== undefined) ? permissions : parentMod.permissions,
            main_run: run,
            options: (options) ? options : []
        });

        log.info("Registered a new module with name", name, "for parent module", parentName, "!");
    }

    public static async run(
        name: string,
        args: IArguments
    ): Promise<string> {
        var mod: IModule | undefined = this._modules.find(m => m.name === name);
        if (!mod) return Promise.reject(name + " module not exists!");

        var cmd_mod: ICommand | undefined = (args.Message.command) ? mod.child_cmds.find(m => m.name === args.Message.command) : undefined;

        if (CooldownControl.contains(name, args.Sender.ID)) {
            return Promise.reject("User " + args.Sender.ID + " is in " + name + " cooldown yet.");
        }

        CooldownControl.put(name, args.Sender.ID, mod.cooldownMs);

        if (args.Sender.Role < mod.permissions) return Promise.reject(name + " module is require more permissions.");

        if (cmd_mod != undefined) {
            return await cmd_mod.main_run(args);
        }

        return await mod.main_run(args);
    }

    public static get(name: string): IModule | undefined { return this._modules.find(m => m.name === name); }

    public static contains(name: string): boolean { 
        const mod: IModule | undefined = this._modules.find(m => m.name === name);
        if (!mod) return false;
        return true;
    }
}

export { AccessLevels, ModuleManager, IModule, ICommand };