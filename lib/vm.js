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

const exit   = process.exit;

class VM extends Object {
    constructor(props) {
        super(props);
        const { stdin, stdout } = props;
        this.stdin    = (typeof stdin !== 'undefined') ? stdin : process.stdin;
        this.stdout   = (typeof stdout !== 'undefined') ? stdout : process.stdout;
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
        this.AddressTable   = null;
        this.shouldRun      = true;
        this.run            = this.run.bind(this);
        this.load           = this.load.bind(this);
        this.loadOnRegister = this.loadOnRegister.bind(this);
        this.findValue      = this.findValue.bind(this);
        this.syscall        = this.syscall.bind(this);
    }

    run(parseTree) {
        const { shouldRun } = this;
        const { SymbolTable, SyntaxTree } = parseTree;
        this.AddressTable = SymbolTable;
        SyntaxTree.forEach(key => {
            if (! shouldRun) {
                console.error(`Cannot execute after recieving terminating signal from OS!`);
                exit(4);
            }
            const { index, item } = key;
            switch (item.action) {
                case 'Load':
                    this.load(item, index);
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

    load(item, index) {
        switch (item.type) {
            case 'Integer':
                const [ desti, integer ] = item.argument;
                this.loadOnRegister(desti, integer, index);
                break;
            case 'Address':
                const [ desta, label ] = item.argument;
                const value = this.findValue(label, index);
                this.loadOnRegister(desta, value, index);
                break;
            default:
                console.error(`Error: Inavlid load statement found at ${line}`);
                exit(4);
        }
    }

    loadOnRegister(register, value, line) {
        if (register === "zero") {
            console.error(`Fatal Error: Cannot overwrite zero register, please check at the line number ${line}`);
            exit(4);
        } else if (this.register.hasOwnProperty(register)) {
            this.register[register] = value;
        } else {
            console.error(`Fatal Error: Invalid register is given, please check at the line number ${line}`);
            exit(4);
        }
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
        const { stdout, register } = this;
        switch (Number(register["$v0"])) {
            case 4:
                stdout.write(`${register["$a0"]}`, 'ASCII');
                break;
            case 10:
                if (stdout === process.stdout) {
                    exit(0);
                } else {
                    stdout.end(() => stdout.on('end', () => exit(0) ));
                }
                this.shouldRun = false;
                break;
            default:
                console.error(`Failed to execute, terminating program...`);
                exit(4);
        }
    }
}

module.exports = VM; // ES5
// export default VM; // ES6
