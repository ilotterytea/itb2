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

ModuleManager.registerParent("massping", 60000, AccessLevels.BROADCASTER, async (args) => {
    const server_response = await axios.get(`https://tmi.twitch.tv/group/user/${args.Target.Username}/chatters`);
    const chatters: {[group_name: string]: string[]} = server_response.data.chatters;
    
    for (const group of Object.keys(chatters)) {
        for (const username of chatters[group]) {
            args.Services.Client.say(`#${args.Target.Username}`, `@${username}, ${args.Message.filtered_msg}`);
        }
    }
    
    return Promise.resolve("");
});