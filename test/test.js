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

"use strict";

const Simulator      = require("../src"),
      mapStateToTest = require("./cases"),
      path           = require("path"),
      fs             = require("fs");

// Testing function
function test(index, testCase) {
    const infile     = path.join(__dirname, `./${testCase}/${testCase}.s`),
          outfile    = path.join(__dirname, `./${testCase}/${testCase}.out`),
          expfile    = path.join(__dirname, `./${testCase}/${testCase}.exp`),
          testfile   = path.join(__dirname, `./${testCase}/${testCase}.test`);

    // Make sure files do exist
    if (! (fs.existsSync(infile) && fs.existsSync(expfile))) {
        console.error("Error: Input file specified cannot be found!\n");
        process.exit(1);
    }

    // Build test programs
    const stdout     = fs.createWriteStream(testfile),
          expected   = fs.readFileSync(expfile, "ASCII"),
          simulator  = new Simulator({ infile, outfile, stdout });

    simulator.compile();
    simulator.run();

    // Handle error and close event
    stdout.on("error", (err) => {
        console.error(`Test#${index} for MIPS-Stimulator failed with` +
            ` error ${err}!`);
        process.exit(1);
    });

    stdout.on("close", () => {
        console.log(`\nFinished execution Build#${index}.` +
            " Collecting results...");
        const output = fs.readFileSync(testfile, "ASCII");

        if (output === expected) {
            console.log(`Test#${index} for MIPS-Stimulator is successful!`);
        }  else {
            console.error(`Test#${index} for MIPS-Stimulator failed with` +
                " wrong output!");
            process.exit(1);
        }
    });
}

// Test Begins
mapStateToTest.forEach((item, i) => {
    const index = i + 1;
    console.log(`\n${index}: Testing MIPS-Simulator for functionality:` +
        ` ${item.test}\n`);
    test(index, item.dest);
});
