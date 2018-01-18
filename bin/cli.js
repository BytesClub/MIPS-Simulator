#!/usr/bin/env node

/*
 *  MIPS-Stimulator : cli.js [Provide a command-line interface for users]
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

const Stimulator = require('../src'),
      path       = require('path'),
      version    = require('../package.json').version,
      cwd        = process.cwd(),
      exit       = process.exit,
      argv       = process.argv,
      helpMsg =

`MIPS-Stimulator v${version} : Copyright (C)  Progyan Bhattacharya, Bytes Club

Usage: mipc <file>

`;

if (argv.length !== 3) {
    console.log(helpMsg + "Missing file argument!");
    exit(1);
}

let file = argv[2];
if (file.indexOf(".s") == -1) {
    console.log(helpMsg + "Source file should have .s extension!");
    exit(2);
}

let infile = path.join(cwd, file),
    outfile = path.join(cwd, file.replace(".s", ".out"));

const stimulator = new Stimulator({ infile, outfile, stdin: process.stdin, stdout: process.stdout });

stimulator.compile();
