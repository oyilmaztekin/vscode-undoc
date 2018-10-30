const babelGenerator = require('babel-generator');

const generateCode = function(parsedAst) {
    let generatedCode = "";
    let outputFunc= babelGenerator.default(parsedAst, generatedCode);
    return outputFunc
}

exports.generateCode = generateCode