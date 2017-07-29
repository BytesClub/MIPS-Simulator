/*
 *  MIPS-Stimulator : preprocessor.js [Strips out comments and blank spaces]
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

class Preprocessor extends Object {
    constructor(props) {
        super(props);
        this.instructions = null;
    }

    processContent(content) {
        if (typeof content === 'undefined' || content == null) {
            let err = "Fatal Error: No content recieved at preprocessor."
            throw err;
        }
        let strings = content.split(/\n|\t/g);
        let list = [];
        strings.map((item, index) => {
            if (! /[#][ ]*\w*/g.test(item) && item.trim().length > 0) {
                list.push(item);
            }
        });
        this.instructions = list;
    }

    getInstructions() {
        const { instructions } = this;
        if (instructions != null) {
            return instructions;
        }
        console.error("The content failed or haven't recieved for preprocessor.");
        process.exit(2);
    }
}

module.exports = Preprocessor; // ES5
// export default Preprocessor; // ES6
