const babelParser = require('@babel/parser')
const fs = require('fs')

const parseToAst = function(file) {
    const data = fs.readFileSync(file,'utf-8');
    const parsedFile =  babelParser.parse(data, {
            sourceType: "module",
            plugins: [
                "jsx",
                "flow",
                "objectRestSpread",
                "dynamicImport",
                "classProperties",
                "classPrivateProperties",
                "exportExtensions",
                "functionBind",
                ['decorators', { decoratorsBeforeExport: true }],
                "asyncGenerators",
                "throwExpressions"
            ]
        })
        return parsedFile
} 

exports.parseToAst = parseToAst