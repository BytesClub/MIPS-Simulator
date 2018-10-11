/*
 *  MIPS-Simulator : vm.js [Virtual Machine for Executing Instructions]
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

const register     = require("./vm/register"),
      load         = require("./vm/load"),
      move         = require("./vm/move"),
      store        = require("./vm/store"),
      add          = require("./vm/add"),
      subtract     = require("./vm/subtract"),
      multiply     = require("./vm/multiply"),
      divide       = require("./vm/divide"),
      logicalAnd   = require("./vm/logical-and"),
      logicalOr    = require("./vm/logical-or"),
      logicalShift = require("./vm/logical-shift"),
      branch       = require("./vm/branch"),
      syscall      = require("./vm/syscall");

class VM extends Object {
    constructor(props) {
        super(props);
        const { stdin, stdout } = props;

        // Member variables
        this.stdin              = typeof stdin !== "undefined" ?
                                  stdin :
                                  process.stdin;
        this.stdout             = typeof stdout !== "undefined" ?
                                  stdout :
                                  process.stdout;
        this.register           = register;
        this.AddressTable       = null;
        this.InstructionSet     = null;
        this.fenceSize          = 0;
        this.ProgramCounter     = -1;
        this.shouldRun          = true;
        this.run                = this.run.bind(this);
        this.execute            = this.execute.bind(this);
        this.load               = load.bind(this);
        this.move               = move.bind(this);
        this.loadOnRegister     = this.loadOnRegister.bind(this);
        this.valueFromRegister  = this.valueFromRegister.bind(this);
        this.encodeFromRegister = this.encodeFromRegister.bind(this);
        this.valueFromLabel     = this.valueFromLabel.bind(this);
        this.store              = store.bind(this);
        this.memory             = this.memory.bind(this);
        this.add                = add.bind(this);
        this.subtract           = subtract.bind(this);
        this.multiply           = multiply.bind(this);
        this.divide             = divide.bind(this);
        this.logicalAnd         = logicalAnd.bind(this);
        this.logicalOr          = logicalOr.bind(this);
        this.logicalShift       = logicalShift.bind(this);
        this.branch             = branch.bind(this);
        this.updatePC           = this.updatePC.bind(this);
        this.syscall            = syscall.bind(this);
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
        const loader = SyntaxTree.shift();
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
        const key = InstructionSet.slice(ProgramCounter,
                    ProgramCounter + 1).shift();

        // Validity of instruction
        if (typeof key === "undefined" || key === null) {
            const counter = Number((ProgramCounter * 4) +
                            0x10000).toString(16).substr(-4);
            console.error("Undefined behaviour found at" +
                `instruction 0x${counter}`);
            process.exit(4);
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
            case "Store":
                this.store(item, index);
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
                console.error("Fatal Error: Undefined action recieved for" +
                    `execution at line ${index}`);
                process.exit(4);
        }
    }

    /*
     * Register File Module [start]
     */
    loadOnRegister(register, value, i) {
        let regObj = null;
        if (/\$r\d+/.test(register)) {
            // Written in $r[n] format
            const index = Number(register.slice(2));
            regObj = this.register.slice(index).shift();
        } else {
            regObj = this.register.find((v) => v.name === register);
        }
        if (typeof regObj === "undefined" || regObj === null) {
            // Invalid register given
            console.error(`Fatal Error: Invalid register ${register} given,` +
                ` please check at the line number ${i}`);
            process.exit(4);
        }
        if (regObj.name === "$zero") {
            // $r0/$zero is a readonly register
            console.error("Fatal Error: Cannot overwrite zero register," +
                ` please check at the line number ${i}`);
            process.exit(4);
        }
        if (typeof value === "number") {
            // Integer value given
            if (isNaN(value)) {
                // Invalid value given
                console.error("Type Error: Type mismatch while storing into" +
                    ` register, expected integer at line ${i}`);
                process.exit(4);
            }
            // Update the value
            regObj.value = value;
        } else {
            // String value given
            regObj.value = value.data;
            regObj.encoding = value.encoding;
        }
    }

    valueFromRegister(register, i) {
        let regObj = null;
        if (/\$r\d+/.test(register)) {
            // Written in $r[n] format
            const index = Number(register.slice(2));
            regObj = this.register.slice(index).shift();
        } else {
            regObj = this.register.find((v) => v.name === register);
        }
        if (typeof regObj === "undefined" || regObj === null) {
            // Invalid register given
            console.error(`Fatal Error: Invalid register ${register} given,` +
                ` please check at the line number ${i}`);
            process.exit(4);
        }
        if (! regObj.hasOwnProperty("value")) {
            // Un-initialized value received
            console.error("Value Error: Un-initialized value found" +
                ` in ${register}, please check at the line number ${i}`);
            process.exit(4);
        }
        if (typeof value === "number" && isNaN(regObj.value)) {
            // Invalid value found
            console.error(`Value Error: Invalid value found in ${register},` +
                ` please check at the line number ${i}`);
            process.exit(4);
        }
        // Return the value
        return regObj.value;
    }

    encodeFromRegister(register, i) {
        let regObj = null;
        if (/\$r\d+/.test(register)) {
            // Written in $r[n] format
            const index = Number(register.slice(2));
            regObj = this.register.slice(index).shift();
        } else {
            regObj = this.register.find((v) => v.name === register);
        }
        if (typeof regObj === "undefined" || regObj === null) {
            // Invalid register given
            console.error(`Fatal Error: Invalid register ${register} given,` +
                ` please check at the line number ${i}`);
            process.exit(4);
        }
        if (! regObj.hasOwnProperty("encoding")) {
            // Encoding information not found
            console.error("Type Error: Non string literal found in" +
                ` ${register}, please check at the line number ${i}`);
            process.exit(4);
        }
        // Return the encoding
        return regObj.encoding;
    }

    valueFromLabel(label, i) {
        const { AddressTable } = this;
        const id = AddressTable.find((item) => item.name === label);
        if (typeof id === "undefined" || id === null) {
            if (label === "main") {
                // Entry point not found
                console.error("Fatal Error: Cannot find main entry point," +
                " failed to start execution");
                process.exit(4);
            }
            // Label (other than main) not found
            console.error(`Reference Error: Cannot find label ${label} at` +
                ` line ${i}`);
            process.exit(4);
        }
        // Default return
        return id.value;
    }
    /*
     * Register File Module [end]
     */

    /*
     * Memory Unit
     */
    memory(target, value, i) {
        const entry = this.AddressTable.find((e) => e.name === target);
        if (typeof entry !== "undefined" && (entry.readOnly === true ||
        entry.type === "Program Instructions")) {
            console.error("Error: Access to read only memory region." +
                ` Permission denied at ${i}`);
            process.exit(4);
        }
        this.AddressTable.push(
            {
                "name": target,
                "type": "Data Declaration",
                "value": {
                    "encoding": "ASCII",
                    "data": value
                }
            }
        );
    }

    /*
     * Branch Resolving Module
     */
    updatePC(address) {
        // Update PC in case branch is taken
        this.ProgramCounter = address - 1;
    }
}

module.exports = VM;
