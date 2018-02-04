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

        // Member variables
        this.stdin    = typeof stdin !== "undefined" ?
                        stdin :
                        process.stdin;
        this.stdout   = typeof stdout !== "undefined" ?
                        stdout :
                        process.stdout;
        this.register = [
            {
                "name": "$zero"
            },
            {
                "name": "$at"
            },
            {
                "name": "$hi"
            },
            {
                "name": "$lo"
            },
            {
                "name": "$v0"
            },
            {
                "name": "$v1"
            },
            {
                "name": "$a0"
            },
            {
                "name": "$a1"
            },
            {
                "name": "$a2"
            },
            {
                "name": "$a3"
            },
            {
                "name": "$t0"
            },
            {
                "name": "$t1"
            },
            {
                "name": "$t2"
            },
            {
                "name": "$t3"
            },
            {
                "name": "$t4"
            },
            {
                "name": "$t5"
            },
            {
                "name": "$t6"
            },
            {
                "name": "$t7"
            },
            {
                "name": "$s0"
            },
            {
                "name": "$s1"
            },
            {
                "name": "$s2"
            },
            {
                "name": "$s3"
            },
            {
                "name": "$s4"
            },
            {
                "name": "$s5"
            },
            {
                "name": "$s6"
            },
            {
                "name": "$s7"
            },
            {
                "name": "$s8"
            },
            {
                "name": "$s9"
            }
        ];
        /* $k0-1, $gp, $sp, $fp, $ra, $f0-$f3, $f4-$f10, $f12-$f14, $f16-$f18,
           $f20-$f31 */
        this.AddressTable       = null;
        this.InstructionSet     = null;
        this.fenceSize          = 0;
        this.ProgramCounter     = -1;
        this.shouldRun          = true;
        this.run                = this.run.bind(this);
        this.execute            = this.execute.bind(this);
        this.load               = this.load.bind(this);
        this.move               = this.move.bind(this);
        this.loadOnRegister     = this.loadOnRegister.bind(this);
        this.valueFromRegister  = this.valueFromRegister.bind(this);
        this.encodeFromRegister = this.encodeFromRegister.bind(this);
        this.valueFromLabel     = this.valueFromLabel.bind(this);
        this.add                = this.add.bind(this);
        this.subtract           = this.subtract.bind(this);
        this.multiply           = this.multiply.bind(this);
        this.divide             = this.divide.bind(this);
        this.logicalAnd         = this.logicalAnd.bind(this);
        this.logicalOr          = this.logicalOr.bind(this);
        this.logicalShift       = this.logicalShift.bind(this);
        this.branch             = this.branch.bind(this);
        this.updatePC           = this.updatePC.bind(this);
        this.syscall            = this.syscall.bind(this);
    }

    /*
     * Initiator Module
     */
    run(parseTree) {
        const { SymbolTable, SyntaxTree } = parseTree;

        // Load content in memory
        this.AddressTable = [].concat(SymbolTable);
        this.InstructionSet = [].concat(SyntaxTree);
        this.fenceSize = this.InstructionSet.length;
        let loader = SyntaxTree.shift();
        if (typeof loader !== "undefined" || loader !== null) {
            // Get entry point
            this.ProgramCounter = this.valueFromLabel("main");
            // Check if valid PC, or exit has called
            while (this.shouldRun && this.ProgramCounter >= 0 &&
                this.ProgramCounter < this.fenceSize) {
                this.execute();
            }
        }
    }

    /*
     * Execution Module
     */
    execute() {
        const { InstructionSet, ProgramCounter } = this;

        // Extract instruction at PC from set
        const key = InstructionSet.slice(ProgramCounter, ProgramCounter + 1)
                    .shift();

        // Validity of instruction
        if (typeof key === "undefined" || key === null) {
            const counter = Number(ProgramCounter * 4 + 0x10000).toString(16)
                            .substr(-4);
            console.error(`Undefined behaviour found at instruction 0x${counter}`);
            exit(4);
        }

        // Increment PC by 1, point to next instrcution
        this.ProgramCounter = this.ProgramCounter + 1;

        // Execute current instrcution
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
                this.loadOnRegister(desti, Number(integer), index);
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
        let regObj = null;
        if (/\$r\d+/.test(register)) {
            // Written in $r[n] format
            let index = Number(register.slice(2));
            regObj = this.register.slice(index).shift();
        } else {
            regObj = this.register.find(v => v.name === register);
        }
        if (typeof regObj === "undefined" || regObj === null) {
            // Invalid register given
            console.error(`Fatal Error: Invalid register ${register} is given, please check at the line number ${line}`);
            exit(4);
        }
        if (regObj.name === "$zero") {
            // $r0/$zero is a readonly register
            console.error(`Fatal Error: Cannot overwrite zero register, please check at the line number ${line}`);
            exit(4);
        }
        if (typeof value === "number") {
            // Integer value given
            if (isNaN(value)) {
                // Invalid value given
                console.error(`Type Error: Type mismatch while storing into register, expected integer at line ${line}`);
                exit(4);
            }
            // Update the value
            regObj.value = value;
        } else {
            // String value given
            regObj.value = value.data;
            regObj.encoding = value.encoding;
        }
    }

    valueFromRegister(register, line) {
        let regObj = null;
        if (/\$r\d+/.test(register)) {
            // Written in $r[n] format
            let index = Number(register.slice(2));
            regObj = this.register.slice(index).shift();
        } else {
            regObj = this.register.find(v => v.name === register);
        }
        if (typeof regObj === "undefined" || regObj === null) {
            // Invalid register given
            console.error(`Fatal Error: Invalid register ${register} is given, please check at the line number ${line}`);
            exit(4);
        }
        if (! regObj.hasOwnProperty("value")) {
            // Un-initialized value received
            console.error(`Value Error: Un-initialized value found in ${register}, please check at the line number ${line}`);
            exit(4);
        }
        if (typeof value === "number" && isNaN(regObj.value)) {
            // Invalid value found
            console.error(`Value Error: Invalid value found in ${register}, please check at the line number ${line}`);
            exit(4);
        }
        // Return the value
        return regObj.value;
    }

    encodeFromRegister(register, line) {
        let regObj = null;
        if (/\$r\d+/.test(register)) {
            // Written in $r[n] format
            let index = Number(register.slice(2));
            regObj = this.register.slice(index).shift();
        } else {
            regObj = this.register.find(v => v.name === register);
        }
        if (typeof regObj === "undefined" || regObj === null) {
            // Invalid register given
            console.error(`Fatal Error: Invalid register ${register} is given, please check at the line number ${line}`);
            exit(4);
        }
        if (! regObj.hasOwnProperty("encoding")) {
            // Encoding information not found
            console.error(`Type Error: Non string literal found in ${register}, please check at the line number ${line}`);
            exit(4);
        }
        // Return the encoding
        return regObj.encoding;
    }

    valueFromLabel(label, line) {
        const { AddressTable } = this;
        let id = AddressTable.find(item => item.name === label);
        if (typeof id === "undefined" || id === null) {
            if (label === "main") {
                // Entry point not found
                console.error(`Fatal Error: Cannot find main entry point, failed to start execution`);
                exit(4);
            }
            // Label (other than main) not found
            console.error(`Reference Error: Cannot find label ${label} at line ${line}`);
            exit(4);
        }
        // Default return
        return id.value;
    }
    /*
     * Register File Module [end]
     */

    /*
     * Arithmetic and Logic Unit [start]
     */
    add(item, i) {
        switch (item.type) {
            case "Register":
                const [ destr, src1, src2 ] = item.argument;
                const value1 = this.valueFromRegister(src1, i);
                const value2 = this.valueFromRegister(src2, i);
                this.loadOnRegister(destr, parseInt(value1 + value2, 10), i);
                break;
            case "Immidiate":
                const [ desti, imm ] = item.argument;
                const valuer = this.valueFromRegister(desti, i);
                const valuei = Number(imm);
                if (isNaN(valuei)) {
                    console.error(`Type Error: Invalid value found at ${i}`);
                    exit(4);
                }
                this.loadOnRegister(desti, parseInt(valuer + valuei, 10), i);
                break;
            default:
                console.error(`Error: Invalid ALU instrcution found at ${i}`);
                exit(4);
        }
    }

    subtract(item, i) {
        switch (item.type) {
            case "Register":
                const [ destr, src1, src2 ] = item.argument;
                const value1 = this.valueFromRegister(src1, i);
                const value2 = this.valueFromRegister(src2, i);
                this.loadOnRegister(destr, parseInt(value1 - value2, 10), i);
                break;
            default:
                console.error(`Error: Invalid ALU instrcution found at ${i}`);
                exit(4);
        }
    }

    multiply(item, i) {
        switch (item.type) {
            case "Register":
                const [ src1, src2 ] = item.argument;
                const value1 = this.valueFromRegister(src1, i);
                const value2 = this.valueFromRegister(src2, i);
                this.loadOnRegister("$lo", parseInt(value1 * value2, 10), i);
                break;
            default:
                console.error(`Error: Invalid ALU instrcution found at ${i}`);
                exit(4);
        }
    }

    divide(item, i) {
        switch (item.type) {
            case "Register":
                const [ src1, src2 ] = item.argument;
                const value1 = this.valueFromRegister(src1, i);
                const value2 = this.valueFromRegister(src2, i);
                this.loadOnRegister("$lo", parseInt(value1 / value2, 10), i);
                this.loadOnRegister("$hi", parseInt(value1 % value2, 10), i);
                break;
            default:
                console.error(`Error: Invalid ALU instrcution found at ${i}`);
                exit(4);
        }
    }

    logicalAnd(item, i) {
        switch (item.type) {
            case "Register":
                const [ destr, src1, src2 ] = item.argument;
                const value1 = this.valueFromRegister(src1, i);
                const value2 = this.valueFromRegister(src2, i);
                this.loadOnRegister(destr, parseInt(value1 && value2, 10), i);
                break;
            case "Immidiate":
                const [ desti, src, imm ] = item.argument;
                const valuer = this.valueFromRegister(src, i);
                const valuei = Number(imm);
                if (isNaN(valuei)) {
                    console.error(`Type Error: Invalid value found at ${i}`);
                    exit(4);
                }
                this.loadOnRegister(desti, parseInt(valuer && valuei, 10), i);
                break;
            default:
                console.error(`Error: Invalid ALU instrcution found at ${i}`);
                exit(4);
        }
    }

    logicalOr(item, i) {
        switch (item.type) {
            case "Register":
                const [ destr, src1, src2 ] = item.argument;
                const value1 = this.valueFromRegister(src1, i);
                const value2 = this.valueFromRegister(src2, i);
                this.loadOnRegister(destr, parseInt(value1 || value2, 10), i);
                break;
            case "Immidiate":
                const [ desti, src, imm ] = item.argument;
                const valuer = this.valueFromRegister(src, i);
                const valuei = Number(imm);
                if (isNaN(valuei)) {
                    console.error(`Type Error: Invalid value found at ${i}`);
                    exit(4);
                }
                this.loadOnRegister(desti, parseInt(valuer || valuei, 10), i);
                break;
            default:
                console.error(`Error: Invalid ALU instrcution found at ${i}`);
                exit(4);
        }
    }

    logicalShift(item, i) {
        switch (item.type) {
            case "Left":
                const [ destl, srcl, imml ] = item.argument;
                const vallr = this.valueFromRegister(srcl, i);
                const valli = Number(imml);
                if (isNaN(valli)) {
                    console.error(`Type Error: Invalid value found at ${i}`);
                    exit(4);
                }
                this.loadOnRegister(destl, parseInt(vallr << valli, 10), i);
                break;
            case "Right":
                const [ destr, srcr, immr ] = item.argument;
                const valrr = this.valueFromRegister(srcr, i);
                const valri = Number(immr);
                if (isNaN(valri)) {
                    console.error(`Type Error: Invalid value found at ${i}`);
                    exit(4);
                }
                this.loadOnRegister(destr, parseInt(valrr >>> valri, 10), i);
                break;
            default:
                console.error(`Error: Invalid ALU instrcution found at ${i}`);
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
        // Update PC in case branch is taken
        this.ProgramCounter = address - 1;
    }
    /*
     * Branch Resolving Module [end]
     */

    /*
     * Interrupt Handler Module
     */
    syscall(line) {
        const { stdout } = this;
        const flagVariable = Number(this.valueFromRegister("$v0"));
        switch (flagVariable) {
            case 1:
                const value = Number(this.valueFromRegister("$a0"));
                if (isNaN(value)) {
                    console.error(`Type Error: Expected integer at ${line}, recieved something else!`);
                    exit(4);
                } else {
                    stdout.write(value.toString());
                }
                break;
            case 4:
                stdout.write(this.valueFromRegister("$a0"),
                    this.encodeFromRegister("$a0"));
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
