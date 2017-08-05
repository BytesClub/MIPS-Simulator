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

const Stimulator = require('../src');

const infile = 'test/HelloWorld.s', outfile = 'test/HelloWorld.out';

const stimulator = new Stimulator({ infile, outfile });

// console.log(stimulator);
stimulator.compile();
//let content = stimulator.getContent();
//console.log(content);
