"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class Logger {
    constructor(extension) {
        this.extension = extension;
        this.logPanel = vscode.window.createOutputChannel('LaTeX Workshop');
        this.compilerLogPanel = vscode.window.createOutputChannel('LaTeX Compiler');
        this.compilerLogPanel.append('Ready');
        this.addLogMessage('Initializing LaTeX Workshop.');
        this.status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -10000);
        this.status.command = 'latex-workshop.actions';
        this.status.show();
        this.displayStatus('repo', 'statusBar.foreground', 'LaTeX Workshop');
    }
    addLogMessage(message) {
        const configuration = vscode.workspace.getConfiguration('latex-workshop');
        if (configuration.get('debug.showLog')) {
            this.logPanel.append(`[${new Date().toLocaleTimeString('en-US', { hour12: false })}] ${message}\n`);
        }
    }
    addCompilerMessage(message) {
        this.compilerLogPanel.append(message);
    }
    clearCompilerMessage() {
        this.compilerLogPanel.clear();
    }
    displayStatus(icon, color, message, timeout = 5000) {
        if (this.statusTimeout) {
            clearTimeout(this.statusTimeout);
        }
        this.status.text = `$(${icon}) ${message}`;
        this.status.tooltip = message;
        this.status.color = new vscode.ThemeColor(color);
        if (timeout > 0) {
            this.statusTimeout = setTimeout(() => this.status.text = `$(${icon})`, timeout);
        }
    }
    displayFullStatus(timeout = 5000) {
        if (this.statusTimeout) {
            clearTimeout(this.statusTimeout);
        }
        const icon = this.status.text.split(' ')[0];
        const message = this.status.tooltip;
        this.status.text = `${icon} ${message}`;
        if (timeout > 0) {
            this.statusTimeout = setTimeout(() => this.status.text = `${icon}`, timeout);
        }
    }
    showLog() {
        this.logPanel.show();
    }
    showCompilerLog() {
        this.compilerLogPanel.show();
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map