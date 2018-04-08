/*
 *  MIPS-Stimulator : register.js [Register Information for VM]
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

const register = [
    {
        "name": "$zero"
    },
    {
        "name": "$at"
    },
    {
        "name": "$hi"
    },
    {
        "name": "$lo"
    },
    {
        "name": "$v0"
    },
    {
        "name": "$v1"
    },
    {
        "name": "$a0"
    },
    {
        "name": "$a1"
    },
    {
        "name": "$a2"
    },
    {
        "name": "$a3"
    },
    {
        "name": "$t0"
    },
    {
        "name": "$t1"
    },
    {
        "name": "$t2"
    },
    {
        "name": "$t3"
    },
    {
        "name": "$t4"
    },
    {
        "name": "$t5"
    },
    {
        "name": "$t6"
    },
    {
        "name": "$t7"
    },
    {
        "name": "$s0"
    },
    {
        "name": "$s1"
    },
    {
        "name": "$s2"
    },
    {
        "name": "$s3"
    },
    {
        "name": "$s4"
    },
    {
        "name": "$s5"
    },
    {
        "name": "$s6"
    },
    {
        "name": "$s7"
    },
    {
        "name": "$s8"
    },
    {
        "name": "$s9"
    }
];
/* $k0-1, $gp, $sp, $fp, $ra, $f0-$f3, $f4-$f10, $f12-$f14,
   $f16-$f18, $f20-$f31 */

module.exports = register;
