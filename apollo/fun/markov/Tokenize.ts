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

class Token {
    public fromWord: string;
    public toWord: string;

    constructor(from: string, to: string) {
        this.fromWord = from;
        this.toWord = to;
    }
}

function Tokenize(text: string): Token[] {
    // Remove bot mention from text:
    text = text.replace(new RegExp(/^((@)?fembajbot(,)?)/), "");

    const _text: string[] = text.trim().split(' ')
    .filter(w => w !== "\x02")
    .filter(w => w !== "\x03");
    
    var tokens: Token[] = [];

    var _word: string = "\x02";

    for (const word of _text) {
        if (word === "") { continue; }
        tokens.push(new Token(_word, word));
        _word = word;
    }

    if (tokens.length === 0) return tokens;

    tokens.push(new Token(_word, "\x03"));
    return tokens;
}

export { Tokenize, Token };