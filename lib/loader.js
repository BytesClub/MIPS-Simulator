/*
 *  MIPS-Stimulator : loader.js [Loads file into memory]
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

class Loader extends Object {
    constructor(props) {
        super(props);
        const { file, flag } = props;

        // House-keeing
        if (typeof file === "undefined" || file === null) {
            const err = "No file parameter passed. Expected one!";
            throw err;
        }

        // Member variables
        const flagDefined = typeof flag !== "undefined";
        this.isSilent     = flagDefined && typeof flag.silent === "boolean" ?
                            flag.silent :
                            false;
        this.showWarn     = flagDefined && typeof flag.warning === "boolean" ?
                            flag.warning :
                            true;
        this.showDetail   = flagDefined && typeof flag.details === "boolean" ?
                            flag.details :
                            false;
        this.loader       = fs;
        this.target       = file;
        this.hasError     = false;
        this.errorText    = null;
        this.error        = null;
        this.content      = null;
        this.getContent   = this.getContent.bind(this);
        this.getError     = this.getError.bind(this);
    }

    // Loads file into content
    load() {
        const { loader, target: file } = this;

        // Check if file exist on path
        if (! loader.existsSync(file)) {
            this.hasError = true;
            this.errorText = `Fatal Eror: The file ${file} does not exist.` +
                " Make sure you supplied right path.";
            return;
        }

        // Check read permission on the file
        try {
            loader.accessSync(file, loader.constants.R_OK);
        } catch (e) {
            this.hasError = true;
            this.errorText = `Fatal Error: Cannot read from file ${file}.` +
                " Make sure you have READ permission on it.";
            this.error = e.toString();
            return;
        }

        // Read file content
        try {
            this.content = loader.readFileSync(file, "ASCII");
        } catch (e) {
            this.hasError = true;
            this.errorText = `Fatal Error: Failed to read from file ${file}.` +
                " Make sure the file is not corrupted.";
            this.error = e.toString();
            return;
        }
    }

    // Returns content
    getContent() {
        const { hasError, content } = this;

        // Check if error took place
        if (! hasError) {
            return content;
        }

        this.getError();
        process.exit(1);
    }

    // Return error
    getError() {
        const
        { hasError, isSilent, showWarn, showDetail, error, errorText } = this;

        // If error occured
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

module.exports = Loader;

/*
 * Usage: Loader({
 *          file: [Name of the file to be loaded]<Required>
 *          flag: [Flag parameter]<Optional> {
 *              silent: [Boolean: No error will be thrown if set to True]
 *              warning: [Boolean: Error will be shown as warning if True]
 *              details: [Boolean: Detail error will be shown if True]
 *          }
 *        });
 */
