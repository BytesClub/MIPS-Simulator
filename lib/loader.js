/*
 *  MIPS-Simulator : loader.js [Loads file into memory]
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

/** class: Loader
 * @desc Loads Instruction Contents from File Passed as Parameter
 * @param {string}      file       - Source File Path
 * @param {Object}      flag       - Configuration Object
 * @prop  {boolean}     isSilent   - Omit Error Message to Standard Error
 * @prop  {boolean}     showWarn   - Display Warning instead of Error/Log
 * @prop  {boolean}     showDetail - Display Details of The Error Message
 * @prop  {FileStream}  loader     - FileStream Module of Node.JS for File IO
 * @prop  {string}      target     - Path to Source File
 * @prop  {boolean}     hasError   - True iff Any Error has Occured
 * @prop  {string}      errorText  - The Error Message
 * @prop  {string}      error      - Details of The Error
 * @prop  {string}      content    - File Contents
 */
class Loader extends Object {
    constructor({ file, flag }) {
        super();

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

    /** method: load
     * @desc Loads File Contents into Content Property
     * @prop {FileStream} loader - File Loader for IO
     * @prop {string}     file   - Target File Path
    */
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

    /** method: getContent
     * @desc Returns File Content to Caller Method
     * @prop {boolean} hasError - If Error has Occured
     * @prop {string}  content  - File Content
     * @return {string} Set of Instructions as String
     */
    getContent() {
        const { hasError, content } = this;

        // Check if error took place
        if (! hasError) {
            return content;
        }

        this.getError();
        process.exit(1);
    }

    /** method: getError
     * @desc Display Error Information if any
     * @prop {boolean} hasError   - True iff Any Error has Occured
     * @prop {boolean} isSilent   - Omit Error Message to Standard Error
     * @prop {boolean} showWarn   - Display Warning instead of Error/Log
     * @prop {boolean} showDetail - Display Details of The Error Message
     * @prop {string}  errorText  - The Error Message
     * @prop {string}  error      - Details of The Error
     */
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
