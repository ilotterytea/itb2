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

    if (!name) return Promise.reject("No user name provided!");

    const response = await axios.get("https://api.ivr.fi/twitch/resolve/" + name, {responseType: "json"});
    const STVThreeLetterAPI = await axios.post("https://7tv.io/v2/gql", {
        "query": "query GetUser($id: String!) {user(id: $id) {...FullUser,, banned, youtube_id}}fragment FullUser on User {id,email, display_name, login,description,role {id,name,position,color,allowed,denied},emote_aliases,emotes { id, name, status, visibility, width, height, urls },owned_emotes { id, name, status, visibility, width, height, urls },emote_ids,editor_ids,editors {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids},editor_in {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids},follower_count,broadcast {type,title,game_name,viewer_count,},twitch_id,broadcaster_type,profile_image_url,created_at,emote_slots,audit_entries {id,type,timestamp,action_user_id,action_user {id, display_name, login,role { id, name, position, color, allowed, denied },profile_image_url,emote_ids},changes {key, values},target {type,data,id},reason}}",
        "variables":{"id":name}
    });

    const data: {[key: string]: any} = response.data;
    const stv_data: {[key: string]: any} = STVThreeLetterAPI.data.data.user;

    if (response.status != 200 || STVThreeLetterAPI.status != 200) return Promise.resolve(await args.Services.Locale.parsedText("msg.api_error", args, [
        response.status || STVThreeLetterAPI.status
    ]));

    if (args.Message.option.find(o => o[0] === "--pfp")) {
        return Promise.resolve(await args.Services.Locale.parsedText("cmd.user.picture", args, [
            data.login,
            data.id,
            data.logo,
            (stv_data && stv_data.profile_image_url) ? ("https:" + stv_data.profile_image_url != data.logo) ? " | 7TV: https:" + stv_data.profile_image_url : "" : ""
        ]));
    }

    if (args.Message.option.find(o => o[0] === "--rules")) {
        return Promise.resolve(await args.Services.Locale.parsedText("cmd.user.rules", args, [
            data.login,
            data.id,
            data.chatSettings.rules.join(', ')
        ]));
    }

    var stringBuilder: string[] = [];

    if (data.displayName && data.login && data.id) stringBuilder.push(await args.Services.Locale.parsedText(
        "cmd.user.lookup", args, [
            data.displayName,
            data.login,
            data.id
        ]
    ));
    

    if (data.bio) stringBuilder.push(await args.Services.Locale.parsedText(
        "cmd.user.lookup.bio", args, [
            data.bio
        ]
    ));

    if (data.chatColor) stringBuilder.push(await args.Services.Locale.parsedText(
        "cmd.user.lookup.color", args, [
            data.chatColor
        ]
    ));

    if (data.partner) stringBuilder.push(await args.Services.Locale.parsedText(
        "cmd.user.lookup.partner", args
    ));

    if (data.affiliate) stringBuilder.push(await args.Services.Locale.parsedText(
        "cmd.user.lookup.affiliate", args
    ));

    if (data.bot) stringBuilder.push(await args.Services.Locale.parsedText(
        "cmd.user.lookup.bot", args
    ));

    if (data.banned) stringBuilder.push(await args.Services.Locale.parsedText(
        "cmd.user.lookup.banned", args
    ));

    if (data.partner) stringBuilder.push(await args.Services.Locale.parsedText(
        "cmd.user.lookup.partner", args
    ));

    if (stv_data) {
        if (stv_data.emote_ids && stv_data.emote_slots) stringBuilder.push(await args.Services.Locale.parsedText(
            "cmd.user.lookup.7tv.emotes", args, [
                stv_data.emote_ids.length,
                stv_data.emote_slots
            ]
        ));

        if (stv_data.editor_ids) stringBuilder.push(await args.Services.Locale.parsedText(
            "cmd.user.lookup.7tv.editors", args, [
                stv_data.editor_ids.length
            ]
        ));

        if (stv_data.role) stringBuilder.push(await args.Services.Locale.parsedText(
            "cmd.user.lookup.7tv.role", args, [
                stv_data.role.name
            ]
        ));
    
        if (stv_data.created_at) stringBuilder.push(await args.Services.Locale.parsedText(
            "cmd.user.lookup.7tv.joined", args, [
                stv_data.created_at
            ]
        ));
    }

    return Promise.resolve(`@${args.Sender.Username}, FeelsDankMan 🔎 ${stringBuilder.join(' | ')}`);
}, ["--pfp", "--rules"]);