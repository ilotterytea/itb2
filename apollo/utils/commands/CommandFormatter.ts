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

import { ICommand, IModule, ModuleManager } from "../modules/ModuleManager";

namespace CommandFormatter {
    export function parseCommand(
        raw_text: string,
        prefix: string,
        isSecondary?: boolean
    ): string | null {
        if (!raw_text.startsWith(prefix)) return null;
        
        const _text: string[] = raw_text.split(' ');
        var command: string | undefined = _text[0];

        command = command.slice(prefix.length, command.length);

        var cmd: IModule | undefined = ModuleManager.get(command);

        if (!cmd) return null;

        if (isSecondary) {
            var _cmd: ICommand | undefined = cmd.child_cmds.find(c => c.name === _text[1]);
            if (_cmd) return _text[1]
            else return null;
        }

        return command;
    }

    export function parseOptions(
        raw_text: string
    ): [string, string | boolean][] {
        const _text: string[] = raw_text.split(' ');

        var options: string[] = _text.filter(m => m.startsWith("-") || m.startsWith("--"));
        var options_with_values: [string, string | boolean][] = [];

        for (const option of options) {
            const _index: number = _text.indexOf(option) + 1;
            var _option: [string, string | boolean] = [
                option,
                true
            ];

            if (_index <= _text.length - 1) {
                if (!(_text[_index].startsWith('-'))) _option[1] = _text[_index];
            }

            options_with_values.push(_option);
        }

        return options_with_values;
    }

    export function parseMessage(
        raw_text: string,
        command: string | null,
        options: [string, string | boolean][]
    ): string {
        var _text: string[] = raw_text.split(' ');

        if (command) {
            for (const cmd of command.split(' ')) {
                if (cmd != "null") delete _text[command.split(' ').indexOf(cmd)];
            }
        }

        for (const option of options) {
            if (_text.includes(option[0])) {
                _text = _text.filter(w => w !== option[0]);
            }
        }

        return _text.join(' ').trim();
    }
}

export default CommandFormatter;