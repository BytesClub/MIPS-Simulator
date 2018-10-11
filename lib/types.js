/*
 *  MIPS-Simulator : types.js [Checks for data types]
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

/** function: checkType
 * @desc Type Checking of Token against Given Type Definition
 * @param  {string} token - Token to be Parsed
 * @param  {string} type  - Data Type Referred by Token
 * @return {boolean} True iff Token is of Valid Data Type
 */
const checkType = (token, type) => {
    if (typeof type !== "string") {
        throw new TypeError("type is expected to be a string.");
    }

    const LabelRegex    = /\w+:/i,
          RegisterRegex = /\$\w+/;

    switch (type) {
        case "label": {
            return LabelRegex.test(token);
        }
        case "Label": {
            return token.trim().length > 0;
        }
        case "Integer": {
            return !isNaN(Number(token));
        }
        case "Register": {
            return RegisterRegex.test(token);
        }
        default: {
            throw new ValueError("invalid type specified.")
        }
    }
};

module.exports = checkType;
