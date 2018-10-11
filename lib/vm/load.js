/*
 *  MIPS-Stimulator : load.js [Load submodule for VM]
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

/** function: load
 * @desc Performs Load Operation Inside Virtual Machine
 * @param {Object} item - Operand Details and Arguments
 * @param {Number} i    - Index of The Instrcution
 */
const load = function (item, i) {
    switch (item.type) {
        case "Integer": {
            const [ dest, integer ] = item.argument;
            this.loadOnRegister(dest, Number(integer), i);
            break;
        }
        case "Address": {
            const [ dest, label ] = item.argument;
            const value = this.valueFromLabel(label, i);
            this.loadOnRegister(dest, value, i);
            break;
        }
        case "Register": {
            const [ dest, src, ofs ] = item.argument;
            const offset = typeof ofs !== "undefined" ?
                           Number(ofs) :
                           0;
            const addr   = Number(this.valueFromRegister(src, i));
            const target = offset !== 0 ?
                           addr + Number(offset) :
                           addr;
            const value  = this.valueFromLabel(target, i);
            this.loadOnRegister(dest, value, i);
            break;
        }
        default:
            console.error(`Error: Invalid load statement found at ${i}`);
            process.exit(4);
    }
};

module.exports = load;
