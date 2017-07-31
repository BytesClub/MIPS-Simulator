/*
 *  MIPS-Stimulator : index.js [Export module for MIPS-Stimulator]
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

const Loader = require('../lib/loader'),
      Lexer  = require('../lib/lexer'),
      Parser = require('../lib/parser');

class Stimulator extends Object {
    constructor(props) {
        super(props);
        const { infile, outfile, flag } = props;
        if (typeof flag !== 'undefined') {
            const { silent, warning, details } = flag;
        }
        if (typeof infile === 'undefined' || infile === null) {
            let err = "No file parameter passed. Expected one!";
            throw err;
        }
        this.loader = new Loader({ file: infile, flag });
        this.lexer  = new Lexer();
        this.parser = new Parser();
        this.target = infile;
        this.object = (typeof outfile === 'string') ? outfile : "asm.out";
    }

    compile() {
        const { loader, target, lexer, parser } = this;
        loader.load();
        let content = loader.getContent();
        console.log("Found Content:");
        console.log(content);
        lexer.processContent(content);
        let list = lexer.getInstructions();
        console.log("Created Tokens:");
        list.map(item => console.log(item.line, item.tokens));
        // parser.generateTokens(list);
        // let tokens = parser.getTokens();
        //tokens.map((item) => console.log(item.line, item.token));
    }
}

module.exports = Stimulator; // ES5
// export default Stimulator; // ES6
