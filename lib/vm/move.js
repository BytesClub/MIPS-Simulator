/*
 *  MIPS-Stimulator : move.js [Move submodule for VM]
 *  Copyright (C)  2017  Progyan Bhattacharya, Bytes Club
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

"use strict";

const move = function (item, i) {
    switch (item.type) {
        case "Register": {
            const [ dest, src ] = item.argument;
            const value = this.valueFromRegister(src, i);
            this.loadOnRegister(dest, value, i);
            break;
        }
        default:
            console.error(`Error: Invalid move statement found at ${i}`);
            process.exit(4);
    }
};

module.exports = move;
