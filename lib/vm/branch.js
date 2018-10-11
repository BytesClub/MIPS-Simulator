/*
 *  MIPS-Stimulator : branch.js [Branch submodule for VM]
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

/** function: branch
 * @desc Performs Branch and Jump Operation Inside Virtual Machine
 * @param {Object} item - Operand Details and Arguments
 * @param {Number} i    - Index of The Instrcution
 */
const branch = function (item, i) {
   switch (item.type) {
       case "Equality": case "Inequality": case "Greater": case "Lesser": {
           const [ lreg, rreg, label ] = item.argument;
           const lval   = this.valueFromRegister(lreg, i);
           const rval   = this.valueFromRegister(rreg, i);
           const target = this.valueFromLabel(label, i);

           switch (item.type) {
               case "Equality": {
                   if (lval === rval) {
                       this.updatePC(target);
                   }
                   break;
               }
               case "Inequality": {
                   if (lval !== rval) {
                       this.updatePC(target);
                   }
                   break;
               }
               case "Greater": {
                   if (lval > rval) {
                       this.updatePC(target);
                   }
                   break;
               }
               case "Lesser": {
                   if (lval < rval) {
                       this.updatePC(target);
                   }
                   break;
               }
           }
           break;
       }
       case "EqualtoZero": {
           const [ lreg, label ] = item.argument;
           const lval   = this.valueFromRegister(lreg, i);
           const target = this.valueFromLabel(label, i);
           if (lval === 0) {
               this.updatePC(target);
           }
           break;
       }
       case "InequaltoZero": {
           const [ lreg, label ] = item.argument;
           const lval   = this.valueFromRegister(lreg, i);
           const target = this.valueFromLabel(label, i);
           if (lval !== 0) {
               this.updatePC(target);
           }
           break;
       }
       case "JumpReg": {
           const [ labelReg ] = item.argument;
           const target = this.valueFromRegister(labelReg, i);
           this.updatePC(target);
           break;
       }
       case "Jump": {
           const [ label ] = item.argument;
           const target = this.valueFromLabel(label, i);
           this.updatePC(target);
           break;
       }
       default:
           console.error(`Error: Invalid branch statement found at ${i}`);
           process.exit(4);
   }
};

module.exports = branch;
