/*
 *  MIPS-Stimulator : test/HelloWorld/index.js [Test module for Basic I/O]
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

module.exports = function() {
    const Stimulator = require('../../src'),
          path       = require('path'),
          fs         = require('fs'),
          exit       = process.exit;

    let infile   = path.join(__dirname, './HelloWorld.s'),
        outfile  = path.join(__dirname, './HelloWorld.out'),
        expfile  = path.join(__dirname, './HelloWorld.exp'),
        testfile = path.join(__dirname, './HelloWorld.test');

    const stdout     = fs.createWriteStream(testfile, { defaultEncoding: 'ASCII' }),
          expected   = fs.readFileSync(expfile, 'ASCII'),
          stimulator = new Stimulator({ infile, outfile, stdout });

    stimulator.compile();

    stdout.on('error', (err) => {
        console.error(`Test for MIPS-Stimulator failed with error ${err}!\n`);
        exit(1);
    });

    stdout.on('close', () => {
        console.log("Finished executing. Collecting results...");
        const output = fs.readFileSync(testfile, 'ASCII');
        if (output === expected) {
            console.log("Test for MIPS-Stimulator is successful!\n");
            exit(0);
        }  else {
            console.log("Test for MIPS-Stimulator failed with wrong output!\n");
            exit(1);
        }
    });
};
