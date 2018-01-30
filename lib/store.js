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

"use strict";

const fs = require("fs");

class Store extends Object {
    constructor(props) {
        super(props);
        const { file, flag } = props;
        if (typeof file === "undefined" || file === null) {
            let err = "No file parameter passed. Expected one!";
            throw err;
        }
        this.isSilent   = (typeof flag !== "undefined" &&
                        typeof flag.silent === "boolean") ?
                        flag.silent :
                        false;
        this.showWarn   = (typeof flag !== "undefined" &&
                        typeof flag.warning === "boolean") ?
                        flag.warning :
                        true;
        this.showDetail = (typeof flag !== "undefined" &&
                        typeof flag.details === "boolean") ?
                        flag.details :
                        false;
        this.store      = fs;
        this.target     = file;
        this.hasError   = false;
        this.errorText  = null;
        this.error      = null;
        this.content    = null;
        this.save       = this.save.bind(this);
        this.getError   = this.getError.bind(this);
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
                store.accessSync(file, store.constants.W_OK);
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
            store.writeFileSync(file, data, "utf8");
        } catch(e) {
            this.hasError = true;
            this.errorText = `Fatal Error: Failed to store into ${file}. Make sure the file is not corrupted.`;
            this.error = e.toString();
            return this.getError();
        }
    }

    // Return error
    getError() {
        const { hasError, isSilent, showWarn, showDetail, error, errorText } = this;
        if (hasError) {
            let errorMsg = errorText;
            if (showDetail && error) {
                errorMsg = `${errorMsg}\n${error}`;
            }
            if (isSilent) {
                if (showWarn) {
                    console.warn(errorMsg);
                } else {
                    console.log(errorMsg);
                }
            } else {
                console.error(errorMsg);
            }
        }
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
