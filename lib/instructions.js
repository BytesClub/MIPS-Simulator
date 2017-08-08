/*
 *  MIPS-Stimulator : instructions.js [Provide instruction information]
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

const isInstruction = (token) => {
    switch (token) {
        case 'li':
            return {
                action: 'Load',
                type: 'Integer',
                arguments: 2,
                argument: ['dest', 'integer'],
                argumentType: ['Register', 'Integer']
            };
        case 'la':
            return {
                action: 'Load',
                type: 'Address',
                arguments: 2,
                argument: ['dest', 'address'],
                argumentType: ['Register', 'Label']
            };
        case 'syscall':
            return {
                action: 'OS',
                type: 'Interrupt',
                arguments: 0
            };
        default:
            return null;

    }
};

module.exports = isInstruction; // ES5
// export default isInstruction; // ES6
