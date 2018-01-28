"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const glob = require("glob");
class Cleaner {
    constructor(extension) {
        this.extension = extension;
    }
    clean() {
        if (this.extension.manager.rootFile !== undefined) {
            this.extension.manager.findRoot();
        }
        const configuration = vscode.workspace.getConfiguration('latex-workshop');
        const globs = configuration.get('latex.clean.fileTypes');
        let outdir = configuration.get('latex.outputDir');
        if (!outdir.endsWith('/') && !outdir.endsWith('\\')) {
            outdir += path.sep;
        }
        const globOutDir = [];
        if (outdir !== './') {
            globs.forEach(globType => globOutDir.push(outdir + globType));
        }
        for (const globType of globs.concat(globOutDir)) {
            glob(globType, { cwd: this.extension.manager.rootDir }, (err, files) => {
                if (err) {
                    this.extension.logger.addLogMessage(`Error identifying files with glob ${globType}: ${files}.`);
                    return;
                }
                for (const file of files) {
                    const fullPath = path.resolve(this.extension.manager.rootDir, file);
                    fs.unlink(fullPath, unlinkErr => {
                        if (unlinkErr) {
                            fs.rmdir(fullPath, rmdirErr => {
                                if (rmdirErr) {
                                    this.extension.logger.addLogMessage(`Error removing file: ${fullPath}`);
                                    return;
                                }
                                this.extension.logger.addLogMessage(`Folder removed: ${fullPath}`);
                            });
                            return;
                        }
                        this.extension.logger.addLogMessage(`File cleaned: ${fullPath}`);
                    });
                }
            });
        }
    }
}
exports.Cleaner = Cleaner;
//# sourceMappingURL=cleaner.js.map