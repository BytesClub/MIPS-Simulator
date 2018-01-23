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

"use strict";

const exit   = process.exit;

class VM extends Object {
    constructor(props) {
        super(props);
        const { stdin, stdout } = props;
        this.stdin    = (typeof stdin !== "undefined") ? stdin : process.stdin;
        this.stdout   = (typeof stdout !== "undefined") ? stdout : process.stdout;
        this.register = {
            "$zero": 0,
            "$at": null,
            "$hi": null,
            "$lo": null,
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
        this.AddressTable      = null;
        this.InstructionSet    = null;
        this.fenceSize         = 0;
        this.ProgramCounter    = -1;
        this.shouldRun         = true;
        this.run               = this.run.bind(this);
        this.execute           = this.execute.bind(this);
        this.load              = this.load.bind(this);
        this.move              = this.move.bind(this);
        this.loadOnRegister    = this.loadOnRegister.bind(this);
        this.valueFromRegister = this.valueFromRegister.bind(this);
        this.valueFromLabel    = this.valueFromLabel.bind(this);
        this.add               = this.add.bind(this);
        this.subtract          = this.subtract.bind(this);
        this.multiply          = this.multiply.bind(this);
        this.divide            = this.divide.bind(this);
        this.logicalAnd        = this.logicalAnd.bind(this);
        this.logicalOr         = this.logicalOr.bind(this);
        this.logicalShift      = this.logicalShift.bind(this);
        this.branch            = this.branch.bind(this);
        this.updatePC          = this.updatePC.bind(this);
        this.syscall           = this.syscall.bind(this);
    }

    /*
     * Initiator Module
     */
    run(parseTree) {
        const { SymbolTable, SyntaxTree } = parseTree;
        this.AddressTable = [].concat(SymbolTable);
        this.InstructionSet = [].concat(SyntaxTree);
        this.fenceSize = this.InstructionSet.length;
        let loader = SyntaxTree.shift();
        if (typeof loader !== "undefined" || loader !== null) {
            this.ProgramCounter = this.valueFromLabel("main", 0);
            while (this.shouldRun && this.ProgramCounter >= 0 && this.ProgramCounter < this.fenceSize) {
                this.execute();
            }
        }
    }

    /*
     * Execution Module
     */
    execute() {
        const { InstructionSet, ProgramCounter } = this;
        let key = InstructionSet.slice(ProgramCounter, ProgramCounter + 1).shift();
        if (typeof key === "undefined" || key === null) {
            let counter = Number(ProgramCounter * 4 + 0x10000).toString(16).substr(-4);
            console.error(`Undefined behaviour found at instruction 0x${counter}`);
            exit(4);
        }
        this.ProgramCounter = this.ProgramCounter + 1;
        const { index, item } = key;
        switch (item.action) {
            case "Load":
                this.load(item, index);
                break;
            case "Move":
                this.move(item, index);
                break;
            case "Add":
                this.add(item, index);
                break;
            case "Subtract":
                this.subtract(item, index);
                break;
            case "Multiplication":
                this.multiply(item, index);
                break;
            case "Division":
                this.divide(item, index);
                break;
            case "And":
                this.logicalAnd(item, index);
                break;
            case "Or":
                this.logicalOr(item, index);
                break;
            case "Shift":
                this.logicalShift(item, index);
                break;
            case "Branch":
                this.branch(item, index);
                break;
            case "OS":
                this.syscall(index);
                break;
            default:
                console.error(`Fatal Error: Undefined action recieved for execution at line ${index}`);
                exit(4);
        }
    }

    /*
     * Register File Module [start]
     */
    load(item, index) {
        switch (item.type) {
            case "Integer":
                const [ desti, integer ] = item.argument;
                this.loadOnRegister(desti, integer, index);
                break;
            case "Address":
                const [ desta, label ] = item.argument;
                const value = this.valueFromLabel(label, index);
                this.loadOnRegister(desta, value, index);
                break;
            default:
                console.error(`Error: Inavlid load statement found at ${line}`);
                exit(4);
        }
    }

    move(item, index) {
        switch (item.type) {
            case "Register":
                const [ dest, src ] = item.argument;
                const value = this.valueFromRegister(src, index);
                this.loadOnRegister(dest, value, index);
                break;
            default:
                console.error(`Error: Inavlid move statement found at ${line}`);
                exit(4);
        }
    }

    loadOnRegister(register, value, line) {
        if (register === "zero") {
            console.error(`Fatal Error: Cannot overwrite zero register, please check at the line number ${line}`);
            exit(4);
        } else if (this.register.hasOwnProperty(register)) {
            if (typeof value === "number" && isNaN(value)) {
                console.error(`Type Error: Type mismatch while storing into register, expected integer at line ${line}`);
                exit(4);
            }
            Object.assign(this.register, { [register]: value });
        } else {
            console.error(`Fatal Error: Invalid register ${register} is given, please check at the line number ${line}`);
            exit(4);
        }
    }

    valueFromRegister(register, line) {
        if (this.register.hasOwnProperty(register)) {
            const val = Number(this.register[register]);
            if (isNaN(val)) {
                console.error(`Value Error: Invalid value found in ${register}, please check at the line number ${line}`);
                exit(4);
            }
            return val;
        } else {
            console.error(`Fatal Error: Invalid register ${register} is given, please check at the line number ${line}`);
            exit(4);
        }
    }

    valueFromLabel(label, index) {
        const { AddressTable } = this;
        let id = AddressTable.find(item => item.name === label);
        if (typeof id === "undefined" || id == null) {
            console.error(`Reference Error: Cannot find label ${label} at line ${line}`);
            exit(4);
        }
        if (id.type === "Data Declaration") {
            return id.value.data;
        }
        return id.value;
    }
    /*
     * Register File Module [end]
     */

    /*
     * Arithmetic and Logic Unit [start]
     */
    add(item, index) {
        switch (item.type) {
            case "Register":
                const [ destr, src1, src2 ] = item.argument;
                const value1 = this.valueFromRegister(src1, index);
                const value2 = this.valueFromRegister(src2, index);
                this.loadOnRegister(destr, parseInt((value1 + value2), 10), index);
                break;
            case "Immidiate":
                const [ desti, imm ] = item.argument;
                const valuer = this.valueFromRegister(desti, index);
                const valuei = Number(imm);
                if (isNaN(valuei)) {
                    console.error(`Type Error: Invalid immidiate value given with add statement at ${index}`);
                    exit(4);
                }
                this.loadOnRegister(desti, parseInt((valuer + valuei), 10), index);
                break;
            default:
                console.error(`Error: Invalid add statement found at ${index}`);
                exit(4);
        }
    }

    subtract(item, index) {
        switch (item.type) {
            case "Register":
                const [ destr, src1, src2 ] = item.argument;
                const value1 = this.valueFromRegister(src1, index);
                const value2 = this.valueFromRegister(src2, index);
                this.loadOnRegister(destr, parseInt((value1 - value2), 10), index);
                break;
            default:
                console.error(`Error: Invalid subtract statement found at ${index}`);
                exit(4);
        }
    }

    multiply(item, index) {
        switch (item.type) {
            case "Register":
                const [ src1, src2 ] = item.argument;
                const value1 = this.valueFromRegister(src1, index);
                const value2 = this.valueFromRegister(src2, index);
                this.loadOnRegister("$lo", parseInt((value1 * value2), 10), index);
                break;
            default:
                console.error(`Error: Inavlid multiply statement found at ${index}`);
                exit(4);
        }
    }

    divide(item, index) {
        switch (item.type) {
            case "Register":
                const [ src1, src2 ] = item.argument;
                const value1 = this.valueFromRegister(src1, index);
                const value2 = this.valueFromRegister(src2, index);
                this.loadOnRegister("$lo", parseInt((value1 / value2), 10), index);
                this.loadOnRegister("$hi", parseInt((value1 % value2), 10), index);
                break;
            default:
                console.error(`Error: Inavlid division statement found at ${index}`);
                exit(4);
        }
    }

    logicalAnd(item, index) {
        switch (item.type) {
            case "Register":
                const [ destr, src1, src2 ] = item.argument;
                const value1 = this.valueFromRegister(src1, index);
                const value2 = this.valueFromRegister(src2, index);
                this.loadOnRegister(destr, parseInt((value1 && value2), 10), index);
                break;
            case "Immidiate":
                const [ desti, src, imm ] = item.argument;
                const valuer = this.valueFromRegister(src, index);
                const valuei = Number(imm);
                if (isNaN(valuei)) {
                    console.error(`Type Error: Invalid immidiate value given with and statement at ${index}`);
                    exit(4);
                }
                this.loadOnRegister(desti, parseInt((valuer && valuei), 10), index);
                break;
            default:
                console.error(`Error: Invalid and statement found at ${index}`);
                exit(4);
        }
    }

    logicalOr(item, index) {
        switch (item.type) {
            case "Register":
                const [ destr, src1, src2 ] = item.argument;
                const value1 = this.valueFromRegister(src1, index);
                const value2 = this.valueFromRegister(src2, index);
                this.loadOnRegister(destr, parseInt((value1 || value2), 10), index);
                break;
            case "Immidiate":
                const [ desti, src, imm ] = item.argument;
                const valuer = this.valueFromRegister(src, index);
                const valuei = Number(imm);
                if (isNaN(valuei)) {
                    console.error(`Type Error: Invalid immidiate value given with or statement at ${index}`);
                    exit(4);
                }
                this.loadOnRegister(desti, parseInt((valuer || valuei), 10), index);
                break;
            default:
                console.error(`Error: Invalid or statement found at ${index}`);
                exit(4);
        }
    }

    logicalShift(item, index) {
        switch (item.type) {
            case "Left":
                const [ destl, srcl, imml ] = item.argument;
                const valuelr = this.valueFromRegister(srcl, index);
                const valueli = Number(imml);
                if (isNaN(valueli)) {
                    console.error(`Type Error: Invalid immidiate value given with shift statement at ${index}`);
                    exit(4);
                }
                this.loadOnRegister(destl, parseInt((valuelr << valueli), 10), index);
                break;
            case "Right":
                const [ destr, srcr, immr ] = item.argument;
                const valuerr = this.valueFromRegister(srcr, index);
                const valueri = Number(immr);
                if (isNaN(valueri)) {
                    console.error(`Type Error: Invalid immidiate value given with shift statement at ${index}`);
                    exit(4);
                }
                this.loadOnRegister(destr, parseInt((valuerr >>> valueri), 10), index);
                break;
            default:
                console.error(`Error: Invalid shift statement found at ${index}`);
                exit(4);
        }
    }
    /*
     * Arithmetic and Logic Unit [end]
     */

    /*
     * Branch Resolving Module [start]
     */
    branch(item, index) {
        switch (item.type) {
            case "Equality":
                const [ eleftReg, erightReg, elabel ] = item.argument;
                const eleftVal = this.valueFromRegister(eleftReg, index);
                const erightVal = this.valueFromRegister(erightReg, index);
                const elabelVal = this.valueFromLabel(elabel, index);
                if (eleftVal === erightVal) {
                    this.updatePC(elabelVal);
                }
                break;
            case "Inequality":
                const [ nleftReg, nrightReg, nlabel ] = item.argument;
                const nleftVal = this.valueFromRegister(nleftReg, index);
                const nrightVal = this.valueFromRegister(nrightReg, index);
                const nlabelVal = this.valueFromLabel(nlabel, index);
                if (nleftVal !== nrightVal) {
                    this.updatePC(nlabelVal);
                }
                break;
            case "Greater":
                const [ gleftReg, grightReg, glabel ] = item.argument;
                const gleftVal = this.valueFromRegister(gleftReg, index);
                const grightVal = this.valueFromRegister(grightReg, index);
                const glabelVal = this.valueFromLabel(glabel, index);
                if (gleftVal > grightVal) {
                    this.updatePC(glabelVal);
                }
                break;
            case "Lesser":
                const [ lleftReg, lrightReg, llabel ] = item.argument;
                const lleftVal = this.valueFromRegister(lleftReg, index);
                const lrightVal = this.valueFromRegister(lrightReg, index);
                const llabelVal = this.valueFromLabel(llabel, index);
                if (lleftVal < lrightVal) {
                    this.updatePC(llabelVal);
                }
                break;
            case "EqualtoZero":
                const [ ezleftReg, ezlabel ] = item.argument;
                const ezleftVal = this.valueFromRegister(ezleftReg, index);
                const ezlabelVal = this.valueFromLabel(ezlabel, index);
                if (ezleftVal === 0) {
                    this.updatePC(ezlabelVal);
                }
                break;
            case "InequaltoZero":
                const [ nzleftReg, nzlabel ] = item.argument;
                const nzleftVal = this.valueFromRegister(nzleftReg, index);
                const nzlabelVal = this.valueFromLabel(nzlabel, index);
                if (nzleftVal !== 0) {
                    this.updatePC(nzlabelVal);
                }
                break;
            case "JumpReg":
                const [ labelReg ] = item.argument;
                const jrlabelVal = this.valueFromRegister(labelReg, index);
                this.updatePC(jrlabelVal);
                break;
            case "Jump":
                const [ jlabel ] = item.argument;
                const jlabelVal = this.valueFromLabel(jlabel, index);
                this.updatePC(jlabelVal);
                break;
            default:
                console.error(`Error: Invalid branch statement found at ${index}`);
                exit(4);
        }
    }

    updatePC(address) {
        this.ProgramCounter = address - 1;
    }
    /*
     * Branch Resolving Module [end]
     */

    /*
     * Interrupt Handler Module
     */
    syscall(line) {
        const { stdout, register } = this;
        switch (Number(register["$v0"])) {
            case 1:
                let value = Number(register["$a0"]);
                if (isNaN(value)) {
                    console.error(`Type Error: Expected integer at ${line}, recieved something else!`);
                    exit(4);
                } else {
                    stdout.write(value.toString());
                }
                break;
            case 4:
                stdout.write(`${register["$a0"]}`, "ASCII");
                break;
            case 10:
                this.shouldRun = false;
                if (stdout === process.stdout) {
                    exit(0);
                } else {
                    stdout.end(() => stdout.on("end", () => exit(0) ));
                }
                break;
            default:
                console.error(`Value Error: Failed to execute, terminating program...`);
                exit(4);
        }
    }
}

module.exports = VM; // ES5
// export default VM; // ES6
