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

const Stimulator = require('../src'),
      path       = require('path'),
      fs         = require('fs'),
      exit       = process.exit;

// Defining states for test
let mapStateToTest = {
    "Basic I/O": "HelloWorld"
};

// Testing function
function  test(testCase) {
    const infile     = path.join(__dirname, `./${testCase}/${testCase}.s`),
          outfile    = path.join(__dirname, `./${testCase}/${testCase}.out`),
          expfile    = path.join(__dirname, `./${testCase}/${testCase}.exp`),
          testfile   = path.join(__dirname, `./${testCase}/${testCase}.test`);

    if (! (fs.existsSync(infile) && fs.existsSync(expfile))) {
        console.error(`Error: Input file specified for testcase cannot be found!`);
        exit(1);
    }

    const stdout     = fs.createWriteStream(`${testfile}`),
          expected   = fs.readFileSync(`${expfile}`, 'ASCII'),
          stimulator = new Stimulator({ infile, outfile, stdout });

    stimulator.compile();

    stdout.on('error', (err) => {
        console.error(`Test for MIPS-Stimulator failed with error ${err}!\n`);
        exit(1);
    });

    stdout.on('close', () => {
        console.log("Finished execution. Collecting results...");
        const output = fs.readFileSync(`${testfile}`, 'ASCII');

        if (output === expected) {
            console.log("Test for MIPS-Stimulator is successful!\n");
        }  else {
            console.error("Test for MIPS-Stimulator failed with wrong output!\n");
            exit(1);
        }
    });
}

// Test starts
Object.entries(mapStateToTest).forEach((item, index) => {
    console.log(`${index + 1}: Testing MIPS-Stimulator for functionality: ${item[0]}\n`);
    test(item[1]);
});
