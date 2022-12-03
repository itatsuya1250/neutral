import * as vscode from 'vscode';

function getText(): string {
    const editor = vscode.window.activeTextEditor;
    const selection = editor?.selection;
    const text = editor?.document.getText(selection);
    return text === undefined ? "" : text;
}

enum FileType {
    html,
    js,
    css,
    other,
}

function getFileType(): FileType {
    const editor = vscode.window.activeTextEditor;
    let fileName = editor?.document.fileName;
    if (fileName === undefined) {
        return FileType.other;
    }
    if (/^.*(.html)$/.test(fileName)) {
        return FileType.html;
    } else if (/^.*(.js)$/.test(fileName)) {
        return FileType.js;
    } else if (/^.*(.css)$/.test(fileName)) {
        return FileType.css;
    } else {
        return FileType.other;
    }
}

function getCommand(fileType: FileType): string {
    switch (fileType) {
        case FileType.html:
            return "html";
        case FileType.js:
            return "script";
        case FileType.css:
            return "style";
        default:
            return "";
    }
}

function replace(text: string, fileType: FileType): string {
    const escapedText = text.replace(/"/g, '\\"');
    const splitText = escapedText.replace(/\r\n/g, '\n').split('\n');
    const replacedText = splitText.map(value => {
        return getCommand(fileType) + '("' + value + '");';
    });
    return replacedText.join('\n');
}

export function exec(): string {
    const text = getText();
    const fileType = getFileType();
    vscode.env.clipboard.writeText(replace(text, fileType));
    return "copy " + getCommand(fileType);
}

