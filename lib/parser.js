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

class Parser extends Object {
    constructor(props) {
        super(props);
        this.tokens = null;
    }

    generateTokens(instructions) {
        if (typeof instructions === 'undefined' || instructions == null) {
            let err = "No instructions recieved for parsing.";
            throw err;
        }
    }

    getTokens() {
        const { tokens } = this;
        if (tokens != null) {
            return tokens;
        }
        console.error("The content failed or haven't recieved for parsing.");
        process.exit(3);
    }
}

module.exports = Parser; // ES5
// export default Parser; // ES6
