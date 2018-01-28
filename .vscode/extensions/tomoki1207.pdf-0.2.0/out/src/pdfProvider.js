/* tslint:disable:quotemark */
"use strict";
const path = require("path");
class PdfDocumentContentProvider {
    constructor(_context) {
        this._context = _context;
    }
    getPath(p) {
        return path.join(this._context.extensionPath, p);
    }
    provideTextDocumentContent(uri) {
        const docUri = encodeURIComponent(uri.query);
        const head = [
            '<!DOCTYPE html>',
            '<html>',
            '<head>',
            '<meta http-equiv="Content-type" content="text/html;charset=UTF-8">',
            `<link rel="stylesheet" type="text/css" href="${this.getPath("lib/pdf.css")}">`,
            '</head>'
        ].join("\n");
        const body = [
            '<body>',
            `<iframe id="pdf-viewer" src="file://${this.getPath("lib/web/viewer.html")}?file=${docUri}">`,
            '</body>'
        ].join("\n");
        const tail = [
            '</html>'
        ].join("\n");
        return head + body + tail;
    }
}
exports.PdfDocumentContentProvider = PdfDocumentContentProvider;
//# sourceMappingURL=pdfProvider.js.map