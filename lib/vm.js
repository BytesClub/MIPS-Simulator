/*
 *  MIPS-Stimulator : vm.js [Virtual Machine for Executing Instructions]
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

const stdin  = process.stdin,
      stdout = process.stdout,
      exit   = process.exit;

class VM extends Object {
    constructor(props) {
        super(props);
        this.register = {
            "$zero": 0,
            "$at": null,
            "$v0": null,
            "$v1": null,
            "$a0": null,
            "$a1": null,
            "$a2": null,
            "$a3": null,
            "$t0": null,
            "$t1": null,
            "$t2": null,
            "$t3": null,
            "$t4": null,
            "$t5": null,
            "$t6": null,
            "$t7": null,
            "$s0": null,
            "$s1": null,
            "$s2": null,
            "$s3": null,
            "$s4": null,
            "$s5": null,
            "$s6": null,
            "$s7": null,
            "$t8": null,
            "$t9": null,
            "$k0": undefined,
            "$k1": undefined,
            "$gp": null,
            "$sp": null,
            "$fp": null,
            "$ra": null
            // $f0-$f3, $f4-$f10, $f12-$f14, $f16-$f18, $f20-$f31
        };
        this.AddressTable = null;
    }

    run(parseTree) {
        const { SymbolTable, SyntaxTree } = parseTree;
        this.AddressTable = SymbolTable;
        SyntaxTree.forEach(key => {
            const { index, item } = key;
            switch (item.action) {
                case 'Load':
                    switch (item.type) {
                        case 'Immidiate':
                            const [ desti, integer ] = item.argument;
                            this.loadOnRegister(desti, integer, index);
                            break;
                        case 'Address':
                            const [ desta, label ] = item.argument;
                            const value = this.findValue(label, index);
                            this.loadOnRegister(desta, value, index);
                            break;
                    }
                    break;
                case 'OS':
                    this.syscall();
                    break;
                default:
                    console.error(`Fatal Error: Undefined action recieved for execution at line ${index}`);
                    exit(4);
            }
        });
    }

    loadOnRegister(register, value, line) {
        if (register === "zero") {
            console.error(`Fatal Error: Cannot overwrite zero register, please check at the line number ${line}`);
            exit(4);
        }
        this.register[register] = value;
    }

    findValue(label, index) {
        const { AddressTable } = this;
        let id = AddressTable.find(item => item.name === label);
        if (typeof id === 'undefined' || id == null) {
            console.error(`Reference Error: Cannot find label ${label} at line ${line}`);
            exit(4);
        }
        if (id.type === "Data Declaration") {
            return id.value.data;
        }
        return id.value;
    }

    syscall() {
        const { register } = this;
        switch (Number(register["$v0"])) {
            case 4:
                stdout.write(register["$a0"]);
                break;
            case 10:
                exit(0);
                break;
            default:
                console.error(`Failed to execute, terminating program...`);
                exit(4);
        }
    }
}

module.exports = VM; // ES5
// export default VM; // ES6
