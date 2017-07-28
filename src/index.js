/*
    MIPS-Stimulator : index.js [Export module for MIPS-Stimulator]
    Copyright (C)  2017  Progyan Bhattacharya, Bytes Club

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

const loader = require('../lib/loader');
/*
class Stimulator {
    constructor({ infile, outfile, flag: { silent, warning } }) {
        this.infile  = infile;
        this.outfile = outfile;
        this.flag    = flag;
    }

    compile() {
        return preprocessor(this.infile);
    }
}
*/

module.exports = loader;
// export default Stimulator; // ES6