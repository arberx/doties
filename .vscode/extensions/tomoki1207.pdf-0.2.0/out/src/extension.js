"use strict";
const vscode = require("vscode");
const pdfProvider_1 = require("./pdfProvider");
const path = require("path");
function activate(context) {
    const provider = new pdfProvider_1.PdfDocumentContentProvider(context);
    const registerProvider = vscode.workspace.registerTextDocumentContentProvider("pdf-preview", provider);
    const openedEvent = vscode.workspace.onDidOpenTextDocument((document) => {
        showDocumentPreview(document);
    });
    const previewCmd = vscode.commands.registerCommand("extension.pdf-preview", (uri) => {
        showPreview(uri);
    });
    // for pdf file already opend.
    if (vscode.window.activeTextEditor) {
        showDocumentPreview(vscode.window.activeTextEditor.document);
    }
    context.subscriptions.push(registerProvider, openedEvent, previewCmd);
}
exports.activate = activate;
function showDocumentPreview(document) {
    if (document.languageId === "pdf" && document.uri.scheme !== "pdf-preview") {
        vscode.commands.executeCommand("workbench.action.closeActiveEditor").then(() => {
            showPreview(document.uri);
        });
    }
}
function showPreview(uri) {
    if (uri.scheme === "pdf-preview")
        return;
    let basename = path.basename(uri.fsPath);
    let columns = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : 1;
    vscode.commands.executeCommand("vscode.previewHtml", buildPreviewUri(uri), columns, basename)
        .then(null, vscode.window.showErrorMessage);
}
function buildPreviewUri(uri) {
    return uri.with({
        scheme: "pdf-preview",
        path: uri.path + ".rendered.pdf",
        query: uri.toString(),
    });
}
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map