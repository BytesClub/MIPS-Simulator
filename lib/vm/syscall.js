/*
 *  MIPS-Stimulator : syscall.js [Interrupt Handler submodule for VM]
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

const syscall = function (line) {
    const { stdout } = this;
    const flagVariable = Number(this.valueFromRegister("$v0"));
    switch (flagVariable) {
        case 1: {
            const value = Number(this.valueFromRegister("$a0"));
            if (isNaN(value)) {
                console.error(`Type Error: Expected integer at ${line},` +
                    " recieved something else!");
                process.exit(4);
            } else {
                stdout.write(value.toString());
            }
            break;
        }
        case 4: {
            stdout.write(this.valueFromRegister("$a0"),
                this.encodeFromRegister("$a0"));
            break;
        }
        case 10: {
            this.shouldRun = false;
            if (stdout === process.stdout) {
                process.exit(0);
            } else {
                stdout.end(() => stdout.on("end", () => process.exit(0) ));
            }
            break;
        }
        default:
            console.error("Value Error: Failed to execute," +
                " terminating program...");
            process.exit(4);
    }
};

module.exports = syscall;
