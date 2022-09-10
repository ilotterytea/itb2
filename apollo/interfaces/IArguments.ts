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
import { AccessLevels } from "../utils/modules/ModuleManager";
import IServices from "./IServices";

/** Arguments. */
interface IArguments {
    /** Services. */
    Services: IServices

    /** Bot info. */
    Bot?: {
        /** Bot's username. */
        Username: string
    },

    /** Sender info. */
    Sender: {
        /** Sender's username. */
        Username: string,

        /** Sender's Twitch ID. */
        ID: string,

        Role: AccessLevels
    },

    /** Channel info. */
    Target: {
        /** Channel's name. */
        Username: string,

        /** Channel's Twitch ID. */
        ID: string
    },

    /** Message. */
    Message: {
        /** Raw message. */
        raw: string,

        /** Primary command to execute (e.g. !ping). */
        run_ts: string | null,

        /** Secondary command to execute with primary (e.g. !set lang). */
        command: string | null,

        /** Options to command (e.g. !massping test --separated). */
        option: [string, string | boolean][],

        /** Message without options, commands. */
        filtered_msg: string
    },

    /** Global settings. */
    Global?: Target
}

export default IArguments;