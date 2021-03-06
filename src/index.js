/*
 *  MIPS-Simulator : index.js [Export module for MIPS-Stimulator]
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

const Loader = require("../lib/loader"),
      Store  = require("../lib/store"),
      Lexer  = require("../lib/lexer"),
      Parser = require("../lib/parser"),
      VM     = require("../lib/vm");

/** class: Simulator
 * @desc MIPS Simulator Definitions
 * @param {string}     infile  - Input File Containing MIPS Program
 * @param {string}     outfile - Output File Containing Abstract Syntax Tree
 * @param {FileStream} stdin   - File Stream to be Used as Standard Input
 * @param {FileStream} stdout  - File Stream to be Used as Standard Output
 * @param {Object}     flag    - Command Line Arguments as Configuration Object
 * @prop  {Loader}     loader  - Loads File Content into Main Memory
 * @prop  {Store}      store   - Saves The AST into Target File
 * @prop  {Lexer}      lexer   - Generate Tokens from Instructions
 * @prop  {Parser}     parser  - Parse Tokens and Create AST
 * @prop  {VM}         vm      - Virtual Machine that Runs The Program
 * @prop  {Array}      object  - Abstract Syntaxt Tree of The Program
 */
class Simulator extends Object {
    constructor({ infile, outfile, stdin, stdout, flag }) {
        super();

        // House-keeping
        if (typeof infile === "undefined" || infile === null
            || typeof outfile === "undefined" || outfile === null) {
            const err = "No file parameter passed. Expected two!";
            throw err;
        }

        // Member variables
        this.loader  = new Loader({ file: infile, flag });
        this.store   = new Store({ file: outfile, flag });
        this.lexer   = new Lexer();
        this.parser  = new Parser();
        this.vm      = new VM({ stdin, stdout });
        this.object  = null;
        this.compile = this.compile.bind(this);
        this.run     = this.run.bind(this);
    }

    /** method: compile
     * @desc Compilation Procedure for The Simulator
     * @prop { Loader } loader - Loads File Content into Main Memory
     * @prop { Lexer }  lexer  - Generate Tokens from Instructions
     * @prop { Parser } parser - Parse Tokens and Create AST
     * @prop { Store }  store  - Saves The AST into Target File
     */
    compile() {
        const { loader, lexer, parser, store } = this;

        // Load content
        loader.load();
        const content = loader.getContent();

        // Lexical analysis
        lexer.processContent(content);
        const tokens = lexer.getInstructions();

        // Parsing of tokens
        parser.parseTokens(tokens);
        const parse = parser.getParseTree();

        // Saving AST
        this.object = parse;
        store.save(parse);
    }

    /** method: run
     * @desc Execution Procedure for The Simulator
     * @prop { VM }    vm      - Virtual Machine that Runs The Program
     * @prop { Array } object  - Abstract Syntaxt Tree of The Program
     */
    run() {
        const { vm, object } = this;

        // Run AST in VM
        vm.run(object);
    }
}

module.exports = Simulator;
