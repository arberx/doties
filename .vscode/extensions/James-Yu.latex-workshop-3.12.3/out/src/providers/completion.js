"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
const citation_1 = require("./completer/citation");
const command_1 = require("./completer/command");
const environment_1 = require("./completer/environment");
const reference_1 = require("./completer/reference");
class Completer {
    constructor(extension) {
        this.extension = extension;
        this.citation = new citation_1.Citation(extension);
        this.command = new command_1.Command(extension);
        this.environment = new environment_1.Environment(extension);
        this.reference = new reference_1.Reference(extension);
        fs.readFile(`${this.extension.extensionRoot}/data/environments.json`, (err1, defaultEnvs) => {
            if (err1) {
                this.extension.logger.addLogMessage(`Error reading default environments: ${err1.message}`);
                return;
            }
            this.extension.logger.addLogMessage(`Default environments loaded`);
            fs.readFile(`${this.extension.extensionRoot}/data/commands.json`, (err2, defaultCommands) => {
                if (err2) {
                    this.extension.logger.addLogMessage(`Error reading default commands: ${err2.message}`);
                    return;
                }
                this.extension.logger.addLogMessage(`Default commands loaded`);
                fs.readFile(`${this.extension.extensionRoot}/data/unimathsymbols.json`, (err3, defaultSymbols) => {
                    if (err2) {
                        this.extension.logger.addLogMessage(`Error reading default unimathsymbols: ${err3.message}`);
                        return;
                    }
                    this.extension.logger.addLogMessage(`Default unimathsymbols loaded`);
                    const env = JSON.parse(defaultEnvs.toString());
                    this.command.initialize(JSON.parse(defaultCommands.toString()), JSON.parse(defaultSymbols.toString()), env);
                    this.environment.initialize(env);
                });
            });
        });
    }
    provideCompletionItems(document, position, _token) {
        return new Promise((resolve, _reject) => {
            const invokeChar = document.lineAt(position.line).text[position.character - 1];
            if (this.command.specialBrackets.hasOwnProperty(invokeChar)) {
                const currentLine = document.lineAt(position.line).text;
                if (position.character > 1 && currentLine[position.character - 2] === '\\') {
                    const mathSnippet = Object.assign({}, this.command.specialBrackets[invokeChar]);
                    if (vscode.workspace.getConfiguration('editor', document.uri).get('autoClosingBrackets') &&
                        (currentLine.length > position.character && [')', ']', '}'].indexOf(currentLine[position.character]) > -1)) {
                        mathSnippet.range = new vscode.Range(position.translate(0, -1), position.translate(0, 1));
                    }
                    else {
                        mathSnippet.range = new vscode.Range(position.translate(0, -1), position);
                    }
                    resolve([mathSnippet]);
                    return;
                }
                else if (['(', '['].indexOf(invokeChar) > -1) {
                    resolve();
                    return;
                }
            }
            const line = document.lineAt(position.line).text.substr(0, position.character);
            for (const type of ['citation', 'reference', 'environment', 'command']) {
                const suggestions = this.completion(type, line);
                if (suggestions.length > 0) {
                    if (type === 'citation') {
                        const configuration = vscode.workspace.getConfiguration('latex-workshop');
                        if (configuration.get('intellisense.citation.type') === 'browser') {
                            resolve();
                            setTimeout(() => this.citation.browser(), 10);
                            return;
                        }
                    }
                    else if (type === 'command') {
                        const configuration = vscode.workspace.getConfiguration('latex-workshop');
                        if (configuration.get('intellisense.surroundCommand.enabled') && this.command.selection.length > 0) {
                            resolve();
                            setTimeout(() => {
                                this.command.surround(this.command.selection);
                                this.command.selection = '';
                                this.command.shouldClearSelection = true;
                            }, 10);
                            return;
                        }
                    }
                    resolve(suggestions);
                    return;
                }
            }
            resolve();
        });
    }
    completion(type, line) {
        let reg;
        let provider;
        switch (type) {
            case 'citation':
                reg = /(?:\\[a-zA-Z]*cite[a-zA-Z]*(?:\[[^\[\]]*\])*){([^}]*)$/;
                provider = this.citation;
                break;
            case 'reference':
                reg = /(?:\\[a-zA-Z]*ref[a-zA-Z]*(?:\[[^\[\]]*\])?){([^}]*)$/;
                provider = this.reference;
                break;
            case 'environment':
                reg = /(?:\\(?:begin|end)(?:\[[^\[\]]*\])?){([^}]*)$/;
                provider = this.environment;
                break;
            case 'command':
                reg = /\\([a-zA-Z]*)$/;
                provider = this.command;
                break;
            default:
                // This shouldn't be possible, so mark as error case in log.
                this.extension.logger.addLogMessage(`Error - trying to complete unknown type ${type}`);
                return [];
        }
        const result = line.match(reg);
        let suggestions = [];
        if (result) {
            suggestions = provider.provide();
        }
        return suggestions;
    }
}
exports.Completer = Completer;
//# sourceMappingURL=completion.js.map