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

const Loader       = require('../lib/loader'),
      Preprocessor = require('../lib/preprocessor');

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
        this.loader     = new Loader({ file: infile, flag });
        this.preprocess = new Preprocessor();
        this.target     = infile;
        this.object     = (typeof outfile === 'string') ? outfile : infile.replace('.s', '.o');
    }

    compile() {
        const { loader, target, preprocess } = this;
        loader.load();
        let content = loader.getContent();
        preprocess.processContent(content);
        let list = preprocess.getInstructions();
        console.log(list.join(' '));
    }
}

module.exports = Stimulator; // ES5
// export default Stimulator; // ES6
