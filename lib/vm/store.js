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

/** function: store
 * @desc Performs Store Operation Inside Virtual Machine
 * @param {Object} item - Operand Details and Arguments
 * @param {Number} i    - Index of The Instrcution
 */
const store = function (item, i) {
    switch (item.type) {
        case "Register": {
            const [ src, dest, ofs ] = item.argument;
            const value  = this.valueFromRegister(src, i);
            const offset = typeof ofs !== "undefined" ?
                           Number(ofs) :
                           0;
            const addr   = Number(this.valueFromRegister(dest, i));
            const target = offset !== 0 ?
                           addr + Number(offset) :
                           addr;
            this.memory(target, value, i);
            break;
        }
        case "Immidiate": {
            const [ value, dest ] = item.argument;
            this.memory(dest, value, i);
            break;
        }
        default:
            console.error(`Error: Invalid store statement found at ${i}`);
            process.exit(4);
    }
};

module.exports = store;
