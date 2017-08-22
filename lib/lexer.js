/*
 *  MIPS-Stimulator : lexer.js [Lexical analysis of strings of instruction]
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

 class Lexer extends Object {
     constructor(props) {
         super(props);
         this.instructions    = null;
         this.processContent  = this.processContent.bind(this);
         this.getInstructions = this.getInstructions.bind(this);
     }

     processContent(content) {
         if (typeof content === "undefined" || content == null) {
             let err = "Fatal Error: No content recieved at lexer."
             throw err;
         }
         try {
             let strings = content.split(/\n/g);
             let list = [];
             strings.forEach((string, index) => {
                 const item = string.trim();
                 if (item.length > 0 && item[0] !== '#') {
                     let instruction = item.replace(/([#]([^\0\n])*)|,/g, '').replace(/\t/g, ' ');
                     let tokens = [].concat.apply([],
                         instruction.split("\"").map((item, index) => {
                             return index % 2 ? item : item.split(' ');
                     })).filter(Boolean);
                     list.push({ line: (index + 1), tokens: tokens });
                 }
             });
             this.instructions = list;
         } catch(e) {
             console.error("Invalid string literal found in 0:0, check correct syntax for details.");
         }
     }

     getInstructions() {
         const { instructions } = this;
         if (instructions != null) {
             return instructions;
         }
         console.error("The content failed or haven't recieved for lexical analysis.");
         process.exit(2);
     }
 }

 module.exports = Lexer; // ES5
 // export default Lexer; // ES6
