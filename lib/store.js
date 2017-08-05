/*
 *  MIPS-Stimulator : store.js [Stores content into file]
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

const fs = require('fs');

class Store extends Object {
    constructor(props) {
        super(props);
        const { file, flag } = props;
        if (typeof flag !== 'undefined') {
            const { silent, warning, details } = flag;
        }
        if (typeof file === 'undefined' || file === null) {
            let err = "No file parameter passed. Expected one!";
            throw err;
        }
        this.store      = fs;
        this.target     = file;
        this.isSilent   = (typeof silent === 'boolean') ? silent : false;
        this.showWarn   = (typeof warning === 'boolean') ? warning : true;
        this.showDetail = (typeof details === 'boolean') ? details : false;
        this.hasError   = false;
        this.errorText  = null;
        this.error      = null;
    }

    // Saves content to file
    save(content) {
        const { store, target:file } = this;
        // Check if file exist on path
        if (store.existsSync(file)) {
            console.log(`${file} already exists, trying to overwrite the content.`);
            store.truncateSync(file);
            // Check write permission on the file
            try {
                loader.accessSync(file, loader.constants.W_OK); // Bug: Not working
            } catch (e) {
                this.hasError = true;
                this.errorText = `Fatal Error: Cannot write to file ${file}. Make sure you have WRITE permission on it.`;
                this.error = e.toString();
                return this.getError();
            }
        }
        // Read file content
        try {
            let data = JSON.stringify(content);
            store.writeFileSync(file, data, 'utf8');
        } catch(e) {
            this.hasError = true;
            this.errorText = `Fatal Error: Failed to store into ${file}. Make sure the file is not corrupted.`;
            this.error = e.toString();
            return this.getError();
        }
    }

    // Return error
    getError() {
        if (! this.hasError) {
            return false;
        }
        let errorText = this.errorText;
        if (this.showDetail && this.error) {
            errorText = `${errorText}\n${this.error}`;
        }
        if (this.silent) {
            if (this.warning) {
                return console.warn(errorText);
            }
            return console.log(errorText);
        }
        return console.error(errorText);
    }
}

module.exports = Store; // ES5
// export default Store; // ES6

/*
 * Usage: Store({
 *          file: [Name of the file to be stored]<Required>
 *          flag: [Flag parameter]<Optional> {
 *              silent: [Boolean: No error will be thrown if set to True]
 *              warning: [Boolean: Error will be shown as warning if True]
 *              details: [Boolean: Detail error will be shown if True]
 *          }
 *        });
 */
