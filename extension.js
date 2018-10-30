// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const parseToAst = require('./lib/parseToAst').parseToAst
const transformToAst = require('./lib/transformAst').transformToAst
const generateCode = require('./lib/generateCode').generateCode
const replaceFile = require('./lib/replaceFile').replaceFile
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    const activeFilePath = vscode.window.activeTextEditor.document.uri.fsPath
    
    const parsedFile = parseToAst(activeFilePath);
    const transformedAst = transformToAst(parsedFile)
    const generatedCode = generateCode(transformedAst)
    replaceFile(activeFilePath, generatedCode)
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    // console.log('Congratulations, your extension "undoc" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.undoc', function () {
        // The code you place here will be executed every time your command is executed
        
        // Display a message box to the user
        vscode.window.showInformationMessage('documents are generated');
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;