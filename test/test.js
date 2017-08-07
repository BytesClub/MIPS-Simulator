/*
 *  MIPS-Stimulator : test.js [Test module for MIPS-Stimulator]
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

// Requiring test cases and their functions
const HelloWorld = require('./HelloWorld');

// Defining states for test
const mapStateToTest = {
    "Basic I/O": HelloWorld
};

// Test starts
Object.keys(mapStateToTest).forEach((item, index) => {
    console.log(`${index + 1}: Testing MIPS-Stimulator for functionality: ${item}\n`);
    if (mapStateToTest.hasOwnProperty(item)) {
        mapStateToTest[item]();
    }
});
