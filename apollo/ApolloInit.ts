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

import { PrismaClient } from "@prisma/client";
import EmoteLib from "emotelib";
import { Client } from "tmi.js";
import { Logger } from "tslog";
import AnonymousClient from "./clients/AnonymousClient";
import TwitchApi from "./clients/ApiClient";
import ApolloClient from "./clients/ApolloClient";
import ConfigIni from "./files/ConfigIni";
import LocalStorage from "./files/LocalStorage";
import Symlinks from "./files/Symlinks";
import { AnonMessageHandler } from "./handlers/AnonMessageHandler";
import Messages from "./handlers/MessageHandler";
import TimerHandler from "./handlers/TimerHandler";
import IConfiguration from "./interfaces/IConfiguration";
import EmoteUpdater from "./utils/emotes/EmoteUpdater";
import Localizator from "./utils/Locale";
import ModuleManager from "./utils/ModuleManager";
const log: Logger = new Logger({name: "itb2-main"});

async function ApolloInit(
    Opts: {[key: string]: any},
    Locale: Localizator,
    symlinks: Symlinks,
    anon_symlinks: Symlinks,
    TmiApi: TwitchApi.Client, 
    Config: IConfiguration,
    Prisma: PrismaClient,
    Storage?: LocalStorage
) {

    const Modules: ModuleManager = new ModuleManager();

    const Timer: TimerHandler = new TimerHandler(Prisma);
    await Timer.init(symlinks.getSymlinks());

    Modules.init();

    const TmiClient: Client = ApolloClient(
        Config.Authorization.Username,
        Config.Authorization.Password,
        Object.keys(symlinks.getSymlinks()),
        Opts["debug"]
    );
    
    const AnonTmiClient: Client = AnonymousClient(
        Object.keys(anon_symlinks.getSymlinks()),
        Opts["debug"]
    );

    const Emotes: EmoteUpdater = new EmoteUpdater({
        identify: {
            access_token: Config.Authorization.AccessToken,
            client_id: Config.Authorization.ClientID
        },
        services: {
            client: TmiClient,
            localizator: Locale,
            twitch_api: TmiApi,
            db: Prisma,
            symlinks: symlinks
        }
    });

    await Emotes.subscribeTo7TVEventAPI();

    try {
        for (const target of await Prisma.target.findMany()) {
            await Emotes.syncAllEmotes(target.alias_id.toString());
        }

        await Messages.Handler({
            Client: TmiClient,
            Locale: Locale,
            Emote: Emotes,
            Module: Modules,
            DB: Prisma,
            TwitchApi: TmiApi,
            Timer: Timer,
            Symlinks: symlinks,
            AnonClient: AnonTmiClient
        });

        await AnonMessageHandler(
            AnonTmiClient,
            Prisma
        );

    } catch (err) {
        log.error(err);
    }

    process.on("SIGHUP", (signal) => {
        TmiClient.disconnect();
        AnonTmiClient.disconnect();
        Emotes.closeWebsocket();
    });
}

export default ApolloInit;