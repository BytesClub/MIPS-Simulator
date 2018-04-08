/*
 *  MIPS-Stimulator : logical-shift.js [Shift Logic submodule for VM]
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

const logicalShift = function (item, i) {
    switch (item.type) {
        case "Left": {
            const [ dest, src, imm ] = item.argument;
            const valr = this.valueFromRegister(src, i);
            const vali = Number(imm);
            if (isNaN(vali)) {
                console.error(`Type Error: Invalid value found at ${i}`);
                process.exit(4);
            }
            this.loadOnRegister(dest, parseInt(valr << vali, 10), i);
            break;
        }
        case "Right": {
            const [ dest, src, imm ] = item.argument;
            const valr = this.valueFromRegister(src, i);
            const vali = Number(imm);
            if (isNaN(vali)) {
                console.error(`Type Error: Invalid value found at ${i}`);
                process.exit(4);
            }
            this.loadOnRegister(dest, parseInt(valr >>> vali, 10), i);
            break;
        }
        default:
            console.error(`Error: Invalid ALU instrcution found at ${i}`);
            process.exit(4);
    }
};

module.exports = logicalShift;
