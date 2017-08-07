/*
 *  MIPS-Stimulator : parser.js [Parsing string and extracting tokens]
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

const exit          = process.exit,
      isInstruction = require('./instructions'),
      checkType     = require('./types');

class Parser extends Object {
    constructor(props) {
        super(props);
        this.AST          = null;
        this.symTable     = null;
        this.parseTokens  = this.parseTokens.bind(this);
        this.getParseTree = this.getParseTree.bind(this);
    }

    parseTokens(instructions) {
        if (typeof instructions === 'undefined' || instructions == null) {
            let err = "No instructions recieved for parsing.";
            throw err;
        }
        let AST = [];
        let type = null;
        let symTable = [];
        instructions.map((item, index) => {
            const { line, tokens:lexer } = item;
            let token = lexer.shift();
            // If it's a declaration
            if (token === '.data' || token === '.text') {
                if (lexer.length != 0) {
                    console.error(`Unexpected token found at ${line}. Please check the correct syntax.`);
                    exit(3);
                }
                type = token === '.data' ? "Data Declaration" : "Program Instructions";
            } else {
                // If type not found
                if (type === null) {
                    console.error("Missing type specification for instructions. Check mannual for details.");
                    exit(3);
                }
                // If it is a label
                if (checkType(token, 'label')) {
                    let label = token.replace(':', '');
                    let symIndex = symTable.findIndex((v) => v.name === label);
                    let value = type === "Data Declaration" && lexer.length == 2 ? {
                        encoding: lexer.shift(),
                        data: escapeString(lexer.shift())
                    } : index;
                    let labelDef = {
                        name: label,
                        type: type,
                        value: value
                    };
                    // Already exists
                    if (symIndex !== -1 && symTable[symIndex].value === 'undefined') {
                        symTable[symIndex] = labelDef;
                    } else {
                        // Simply push the name
                        symTable.push(labelDef);
                    }
                } else {
                    // If it is an instruction
                    let type = isInstruction(token)
                    if (typeof type !== 'undefined' && type !== null) {
                        const { argumentType } = type;
                        let args = [];
                        if (lexer.length !== type.arguments) {
                            console.error(`Invalid number of arguments provided with ${type.action} instruction at line ${line}.`);
                            exit(3);
                        }
                        for (let i = 0; i < type.arguments; i++) {
                            let arg = lexer.shift();
                            if (checkType(arg, argumentType[i])) {
                                args.push(arg);
                            } else {
                                // Invalid argument
                                console.error(`Invalid argument provided with ${type.action} instruction; Expected ${argumentType[i]}, found ${arg} at line ${line}`);
                                exit(3);
                            }
                        }
                        type.argument = args;
                        AST.push({ index: line, item: type });
                    } else {
                        // Invalid otherwise
                        console.error(`Cannot understand token at ${line}. Please check the mannual for details.`);
                        exit(3);
                    }
                }
            }
        });
        this.AST      = AST;
        this.symTable = symTable;
    }

    getParseTree() {
        const { AST, symTable } = this;
        if (AST != null && symTable != null) {
            return { SyntaxTree: AST, SymbolTable: symTable };
        }
        console.error("The content failed or haven't recieved for parsing.");
        exit(3);
    }
}

const escapeString = (string) => {
    return string.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\'/g, '\'')
            .replace(/\\"/g, '\"').replace(/\\r/g, '\r').replace(/\\f/g, '\f');
}

module.exports = Parser; // ES5
// export default Parser; // ES6
