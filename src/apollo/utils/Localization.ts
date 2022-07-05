// Copyright (C) 2022 ilotterytea
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

namespace Localizator {
    export class Localizator {
        constructor() {

        }

        async function parsedText(line_id: string, channel_id: string | undefined, ...args: string[]) {
            return "";
        }
    }

    export async function distLanguageFiles(raw_json: any) {
        var json: any;
    
        Object.keys(raw_json).forEach(async (value: string) => {
            Object.keys(raw_json[value]).forEach(async (i_value: string) => {
                if (!(i_value in json)) json[i_value] = {};
    
                json[i_value][value] = raw_json[value][i_value];
            });
        });
        return json;
    }   
}

export default Localizator;