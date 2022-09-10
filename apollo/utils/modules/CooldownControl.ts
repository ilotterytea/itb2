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

class CooldownControl {
    private static _users: {
        [module_name: string]: {
            user_id: string,
            timer: NodeJS.Timeout
        }[]
    } = {};

    public static put(
        module_name: string,
        user_id: string,
        cooldownMs: number
    ): void {
        if (!(module_name in this._users)) {
            this._users[module_name] = [];
        }

        if (!(this._users[module_name].find(u => u.user_id === user_id))) {
            this._users[module_name].push({
                user_id: user_id,
                timer: setTimeout(() => {
                    this._users[module_name] = this._users[module_name].filter(u => u.user_id !== user_id);
                }, cooldownMs)
            })
        }
    }

    public static get(name: string, user_id: string): {
        user_id: string,
        timer: NodeJS.Timeout
    } | undefined {
        if (!this.contains(name, user_id)) return undefined;

        return this._users[name].find(u => u.user_id === user_id);
    }

    public static contains(name: string, user_id: string): boolean { 
        if (!(name in this._users)) return false;
        if (!this._users[name].find(u => u.user_id === user_id)) return false;
        return true;
     }
}

export default CooldownControl;