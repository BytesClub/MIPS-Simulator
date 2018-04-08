/*
 *  MIPS-Stimulator : multiply.js [Multiplyer submodule for VM]
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

const multiply = function (item, i) {
    switch (item.type) {
        case "Register": {
            const [ src1, src2 ] = item.argument;
            const value1 = this.valueFromRegister(src1, i);
            const value2 = this.valueFromRegister(src2, i);
            this.loadOnRegister("$lo", parseInt(value1 * value2, 10), i);
            break;
        }
        default:
            console.error(`Error: Invalid ALU instrcution found at ${i}`);
            process.exit(4);
    }
};

module.exports = multiply;
