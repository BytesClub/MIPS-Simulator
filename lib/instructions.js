/*
 *  MIPS-Stimulator : instructions.js [Provide instruction information]
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

const isInstruction = (token) => {
    switch (token.toLowerCase()) {
        case 'li':
            return {
                action: 'Load',
                type: 'Integer',
                arguments: 2,
                argument: ['dest', 'integer'],
                argumentType: ['Register', 'Integer']
            };
        case 'la':
            return {
                action: 'Load',
                type: 'Address',
                arguments: 2,
                argument: ['dest', 'address'],
                argumentType: ['Register', 'Label']
            };
        case 'move': case 'mfc0':
            return {
                action: 'Move',
                type: 'Register',
                arguments: 2,
                argument: ['dest', 'src'],
                argumentType: ['Register', 'Register']
            };
        case 'add':
            return {
                action: 'Add',
                type: 'Register',
                arguments: 3,
                argument: ['dest', 'src1', 'src2'],
                argumentType: ['Register', 'Register', 'Register']
            };
        case 'addi':
            return {
                action: 'Add',
                type: 'Immidiate',
                arguments: 2,
                argument: ['dest', 'addend'],
                argumentType: ['Register', 'Integer']
            };
        case 'sub':
            return {
                action: 'Subtract',
                type: 'Register',
                arguments: 3,
                argument: ['dest', 'src1', 'src2'],
                argumentType: ['Register', 'Register', 'Register']
            };
        case 'mult':
            return {
                action: 'Multiplication',
                type: 'Register',
                arguments: 2,
                argument: ['multiplicand', 'multiplier'],
                argumentType: ['Register', 'Register']
            };
        case 'div':
            return {
                action: 'Division',
                type: 'Register',
                arguments: 2,
                argument: ['divisor', 'dividend'],
                argumentType: ['Register', 'Register']
            };
        case 'mfhi':
            return {
                action: 'Move',
                type: 'Register',
                arguments: 1,
                argument: ['dest', '$hi'],
                argumentType: ['Register', 'Register']
            };
        case 'mflo':
            return {
                action: 'Move',
                type: 'Register',
                arguments: 1,
                argument: ['dest', '$lo'],
                argumentType: ['Register', 'Register']
            };
        case 'and':
            return {
                action: 'And',
                type: 'Register',
                arguments: 3,
                argument: ['dest', 'src1', 'src2'],
                argumentType: ['Register', 'Register', 'Register']
            };
        case 'andi':
            return {
                action: 'And',
                type: 'Immidiate',
                arguments: 3,
                argument: ['dest', 'src', 'imm'],
                argumentType: ['Register', 'Register', 'Integer']
            };
        case 'or':
            return {
                action: 'Or',
                type: 'Register',
                arguments: 3,
                argument: ['dest', 'src1', 'src2'],
                argumentType: ['Register', 'Register', 'Register']
            };
        case 'ori':
            return {
                action: 'Or',
                type: 'Immidiate',
                arguments: 3,
                argument: ['dest', 'src', 'imm'],
                argumentType: ['Register', 'Register', 'Integer']
            };
        case 'sll':
            return {
                action: 'Shift',
                type: 'Left',
                arguments: 3,
                argument: ['dest', 'src', 'imm'],
                argumentType: ['Register', 'Register', 'Integer']
            };
        case 'srl':
            return {
                action: 'Shift',
                type: 'Right',
                arguments: 3,
                argument: ['dest', 'src', 'imm'],
                argumentType: ['Register', 'Register', 'Integer']
            };
        case 'beq':
            return {
                action: 'Branch',
                type: 'Equality',
                arguments: 3,
                argument: ['value', 'comprator', 'label'],
                argumentType: ['Register', 'Register', 'Label']
            };
        case 'bne':
            return {
                action: 'Branch',
                type: 'Inequality',
                arguments: 3,
                argument: ['value', 'comprator', 'label'],
                argumentType: ['Register', 'Register', 'Label']
            };
        case 'bgt':
            return {
                action: 'Branch',
                type: 'Greater',
                arguments: 3,
                argument: ['value', 'comprator', 'label'],
                argumentType: ['Register', 'Register', 'Label']
            };
        case 'blt':
            return {
                action: 'Branch',
                type: 'Lesser',
                arguments: 3,
                argument: ['value', 'comprator', 'label'],
                argumentType: ['Register', 'Register', 'Label']
            };
        case 'bez':
            return {
                action: 'Branch',
                type: 'EqualtoZero',
                arguments: 2,
                argument: ['value', 'label'],
                argumentType: ['Register', 'Label']
            };
        case 'bnez':
            return {
                action: 'Branch',
                type: 'InequaltoZero',
                arguments: 2,
                argument: ['value', 'label'],
                argumentType: ['Register', 'Label']
            };
        case 'j':
            return {
                action: 'Branch',
                type: 'JumpReg',
                arguments: 1,
                argument: ['label'],
                argumentType: ['Register']
            };
        case 'jr':
            return {
                action: 'Branch',
                type: 'Jump',
                arguments: 1,
                argument: ['label'],
                argumentType: ['Label']
            };
        case 'syscall':
            return {
                action: 'OS',
                type: 'Interrupt',
                arguments: 0,
                argumentType: []
            };
        default:
            return null;

    }
};

module.exports = isInstruction; // ES5
// export default isInstruction; // ES6
