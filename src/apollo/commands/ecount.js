// Copyright (C) 2022 NotDankEnough (iLotterytea)
// 
// This file is part of iLotteryteaLive.
// 
// iLotteryteaLive is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// iLotteryteaLive is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with iLotteryteaLive.  If not, see <http://www.gnu.org/licenses/>.

// Libraries.
const { readFileSync } = require("fs");
const { stringify } = require("querystring");
const tmiJs = require("tmi.js");

/**
 * Help.
 */
exports.help = {
    value: true,
    name: "Emote Count!",
    author: "ilotterytea",
    description: "Shows how much of the specified emote has been used.",
    cooldownMs: 1500,
    superUserOnly: false
}

/**
 * Run the command.
 * @param {*} client Client.
 * @param {*} target Target.
 * @param {*} user User.
 * @param {*} msg Message.
 * @param {*} args Arguments.
 */
exports.run = async (client, target, user, msg, args) => {
    if (!inCooldown.includes(user.username)) {
        const mArgs = msg.split(' ');

        if (mArgs.length == 1) {
            client.say(target, `@${user.username}, provide an emote.`);
            return;
        };
        
        if (mArgs[1] in args.emote_data) {
            client.say(target, `${mArgs[1]} has been used ${args.emote_data[mArgs[1]].toLocaleString()} times.`);
            return;
        } else {
            client.say(target, `@${user.username}, WHAT THE HELL IS ${mArgs[1]} ? YEAHBUT7TV 💢 `);
        }

        inCooldown.push(user.username);
        setTimeout(() => inCooldown = inCooldown.filter(u => u !== user.username), this.help.cooldownMs);
    }
};

let inCooldown = [];