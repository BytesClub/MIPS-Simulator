/*
 *  MIPS-Simulator : parser.js [Parsing string and extracting tokens]
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

const isInstruction = require("./instructions"),
      checkType     = require("./types"),
      mapToEncoding = require("./encoding");

const escapeString  = (string) => {
            return string.replace(/\\n/g, "\n")
                         .replace(/\\t/g, "\t")
                         .replace(/\\"/g, "\"")
                         .replace(/\\r/g, "\r")
                         .replace(/\\f/g, "\f");
      };

class Parser extends Object {
    constructor(props) {
        super(props);
        this.AST          = null;
        this.symTable     = null;
        this.parseTokens  = this.parseTokens.bind(this);
        this.getParseTree = this.getParseTree.bind(this);
    }

    parseTokens(instructions) {
        // Check if instructions are valid
        if (typeof instructions === "undefined" || instructions === null) {
            const err = "No instructions recieved for parsing.";
            throw err;
        }

        const AST      = [],
              symTable = [];
        let type     = null,
            startPtr = 0;
        instructions.forEach((item, index) => {
            const { line, tokens: lexer } = item;
            const token = lexer.shift();

            // Invalid token recieved
            if (typeof token === "undefined" || token === null) {
                console.error(`Unexpected token found at ${line}.` +
                    " Please check the correct syntax.");
                process.exit(3);
            }

            // If it's a declaration
            if (token === ".data" || token === ".text") {
                if (lexer.length !== 0) {
                    console.error(`Unexpected token found at ${line}.` +
                        " Please check the correct syntax.");
                    process.exit(3);
                }
                if (token === ".data") {
                    type = "Data Declaration";
                } else {
                    type = "Program Instructions";
                    startPtr = index + 1;
                }
            } else {
                // If type not found
                if (type === null) {
                    console.error("Missing type specification for" +
                        ` instruction at ${line}. Check mannual for details.`);
                    process.exit(3);
                }

                // If it is a label
                if (checkType(token, "label")) {
                    const label = token.replace(":", "");
                    const symEntry = symTable.find((v) => v.name === label);
                    const value = type === "Data Declaration" ?
                        {
                            encoding: lexer.length === 2 ?
                                mapToEncoding(lexer.shift()) :
                                "ASCII",
                            data: escapeString(lexer.shift())
                        } :
                        index - startPtr;
                    const labelDef = {
                        type,
                        value,
                        name: label
                    };

                    if (type === "Data Declaration") {
                        labelDef.readOnly = true;
                    }

                    // Already exists
                    if (typeof symEntry !== "undefined" &&
                    symEntry.value === "undefined") {
                        Object.assign(symEntry, labelDef);
                    } else {
                        // Simply push the name
                        symTable.push(labelDef);
                    }
                } else {
                    // If it is an instruction
                    const type = isInstruction(token);
                    if (typeof type !== "undefined" && type !== null) {
                        const argumentType = type.argumentType.slice(0);
                        const args = [];
                        if (lexer.length !== type.arguments) {
                            console.error("Invalid number of arguments" +
                                ` provided with ${type.action} instruction` +
                                ` at line ${line}.`);
                            process.exit(3);
                        }

                        // Recieve necessary arguments
                        for (let i = 0; i < type.arguments; i++) {
                            const arg = lexer.shift();
                            const argType = argumentType.shift();
                            if (checkType(arg, argType)) {
                                args.push(arg);
                            } else {
                                // Invalid argument
                                console.error("Invalid argument provided with" +
                                    ` ${type.action} instruction; Expected` +
                                    ` ${argType}, found ${arg} at` +
                                    ` line ${line}`);
                                process.exit(3);
                            }
                        }
                        type.argument = args;
                        AST.push({ index: line, item: type });
                    } else {
                        // Invalid otherwise
                        console.error(`Cannot understand token at ${line}.` +
                            " Please check the mannual for details.");
                        process.exit(3);
                    }
                }
            }
        });
        this.AST      = AST;
        this.symTable = symTable;
    }

    getParseTree() {
        const { AST, symTable } = this;
        if (AST !== null && symTable !== null) {
            const retVal = Object.assign({}, {
                SyntaxTree: AST,
                SymbolTable: symTable
            });
            return retVal;
        }
        console.error("The content failed or haven't recieved for parsing.");
        process.exit(3);
    }
}

module.exports = Parser;
