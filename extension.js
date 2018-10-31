// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const Stage = require('./lib/astStages').AstStages

const stages = new Stage()
function activate(context) {
    const activeFilePath = vscode.window.activeTextEditor.document.uri.fsPath
    
    const parsedFile = stages.parseToAst(activeFilePath)
    const transformedAst = stages.transformToAst(parsedFile)
    const generatedCode = stages.generateCode(transformedAst)
    
    stages.replaceFile(activeFilePath, generatedCode)
    
    let disposable = vscode.commands.registerCommand('extension.undoc', function () {
        // Display a message box to the user
        vscode.window.showInformationMessage('documents are successfully generated');
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;