/*
 *  MIPS-Simulator : lexer.js [Lexical analysis of strings of instruction]
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

const exit = process.exit;

/** class: Lexer
 * @desc Tokenizer Module for The Simulator
 * @prop {Array} instructions - Set of MIPS-IV Instructions
 */
class Lexer extends Object {
    constructor() {
        super();
        this.instructions    = null;
        this.processContent  = this.processContent.bind(this);
        this.getInstructions = this.getInstructions.bind(this);
    }

    /** method: processContent
     * @desc Extract Tokens from File Content and Add Index for Debugging
     * @param {string} content - File Content from infile File Stream
     */
    processContent(content) {
        // Check if content exists
        if (typeof content === "undefined" || content === null) {
            const err = "Fatal Error: No content recieved at lexer.";
            throw err;
        }
        try {
            // Tokenize the content by each string
            const strings = content.split(/\n/g),
                  list    = [];
            strings.forEach((string, index) => {
                const item = string.trim();
                if (item.length > 0 && item[0] !== "#") {
                    const instruction = item.replace(/([#]([^\0\n])*)|,/g, "")
                                          .replace(/\t/g, " ");
                    const tokens = [].concat.apply([],
                        instruction.split("\"").map((item, index) => {
                            return index % 2 ?
                                item :
                                item.split(" ");
                    })).filter(Boolean);
                    list.push({
                        tokens,
                        line: index + 1
                    });
                }
            });
            this.instructions = list;
        } catch (e) {
            console.error("Lexical analysis failed, check correct syntax.");
            exit(2);
        }
    }

    /** method: getInstructions
     * @desc Returns Tokenized Instructions to Caller Method
     * @return {Array} List of Tokenized Instructions
    */
    getInstructions() {
        const { instructions } = this;
        // Check if instructions exist
        if (instructions !== null) {
            return instructions;
        }
        console.error("The content failed or haven't recieved for lexical" +
            " analysis.");
        exit(2);
    }
}

module.exports = Lexer;
