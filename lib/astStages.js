const babelParser = require('@babel/parser')
const fs = require('fs')
const AstTransformMethods = require('./astTransformMethods').AstTransformer
const Transformers = new AstTransformMethods()

function AstStages() {}

AstStages.prototype.parseToAst = function(file) {
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

AstStages.prototype.transformToAst = function(ast){
    const traverse = require('babel-traverse').default
    traverse(ast, {
        FunctionDeclaration: function(path) {
            try{
                if ( path.node.hasOwnProperty('leadingComments') ) {
                    return
                }
                const node = path.node
                const params = node.params
                const blockScope = node.body.body
                
                let fn = {
                    "params": [],
                    "name": null,
                    "returnedValue": null,
                    "loc": null,
                    "flow":false
                }      
                fn.name = node.id.name
                fn.loc = node.id.loc
                
                if ( params.length > 0 ) {
                    Transformers.checkParameterTypeForFlow(params, fn)
                }
                
                for( let b in blockScope ){
                    const activeScope = blockScope[b]
                    if ( !node.hasOwnProperty('returnType') ) {
                        Transformers.checkReturnedStatementsForJSFiles(activeScope, fn)
                    }
                    else {
                        Transformers.checkReturnedTypeForFlow(node, fn)
                    }
                }
                
                let processedTemplate = AstStages.prototype.createDocTemplate(fn)
                let leadComment = [ 
                    {
                        type:"CommentBlock",
                        value: processedTemplate
                    }
                ]
                
                path.node.leadingComments = leadComment

            } catch (Error) {
                console.error("\x1b[0m \x1b[31m", "Node Traverser get exception when transforming the AST") // eslint-disable-line
                console.error("\x1b[0m \x1b[31m", `${Error}`) // eslint-disable-line
                throw Error
            }
        },

        /**
         * @summary Traverses Flow Type Interfaces and collects their all properties.
         * @param {object} path - node tree with its sub branches and its parent properties.  
        */

        TypeAlias:function ( path ) {
            
            const node = path.node
            try {
                if ( node.hasOwnProperty('leadingComments') ) {
                    return
                }
                const typeName = node.id.name
                const props = path.node.right.properties
                
                let fn = {
                    "params":[],
                    "name": typeName,
                    "flow":true
                }

                for(let p of props) {
                    if ( p.value.hasOwnProperty("id") ) {
                        if ( p.value.id.hasOwnProperty('id') ) {
                            fn.params.push(
                                {
                                    "name": p.key.name,
                                    "type": p.value.id.id.name || "type"
                                }
                            )
                        }
                        else {
                            fn.params.push(
                                {
                                    "name": p.key.name,
                                    "type": p.value.id.name || "type"
                                }
                            )
                        }
                        
                    }
                    
                    if ( p.value.hasOwnProperty('types') ) {
                        // FIXME: fix multiple propname : type problem
                        for (let t of p.value.types) {
                            if ( t.hasOwnProperty('id') ) {
                                fn.params.push( 
                                    {
                                        "name": p.key.name,
                                        "type": t.id.id.name
                                    }
                                )
                            }
                            else {
                                fn.params.push( 
                                    {
                                        "name": p.key.name,
                                        "type": t.type
                                    }
                                )
                            }
                        }
                    }
                }
                
                let processedTemplate = AstStages.prototype.createDocTemplate(fn)
                
                let leadComment = [ 
                    {
                        type:"CommentBlock",
                        value: processedTemplate
                    }
                ]
                
                path.node.leadingComments = leadComment
            
                
            } catch ( Error ) {
                console.error("\x1b[0m \x1b[31m", "Traverser get exception on the AST") // eslint-disable-line
                console.error("\x1b[0m \x1b[31m", `${Error}`) // eslint-disable-line
                throw Error
                
            }
        },

        ClassMethod:function(path){
            try{
                if ( path.node.hasOwnProperty('leadingComments') ) {
                    return
                }
                let fn = {
                    "params": [],
                    "name": "",
                    "states": [],
                    "returnedValue":null,
                    "flow": false
                }   
                
                let node = path.node 
                
                if ( node.key.name !== "render" ) {
                    fn.name = node.key.name
                    fn.loc = node.loc
                    const params = node.params
                    
                    Transformers.checkParameterTypeForFlow( params, fn )
                    
                    const blockScope = node.body.body
                    
                    for( let b in blockScope ) {
                        const activeScope = blockScope[b]

                        if ( !node.hasOwnProperty('returnType') ) {
                            Transformers.checkReturnedStatementsForJSFiles(activeScope, fn)
                        }

                        else {
                            Transformers.checkReturnedTypeForFlow(node, fn)
                        }
                        
                        const isMemberAssignmentObject = activeScope.expression

                        Transformers.checkStatesForJSFiles( isMemberAssignmentObject, fn )
                        
                    }
                    
                    let processedTemplate = AstStages.prototype.createDocTemplate(fn)
                    let leadComment = [ 
                        {
                            type:"CommentBlock",
                            value: processedTemplate
                        }
                    ]
                    
                    path.node.leadingComments = leadComment
                }
            } catch ( Error ) {
                console.error("\x1b[0m \x1b[31m", "Traverser get exception on the AST") // eslint-disable-line
                console.error("\x1b[0m \x1b[31m", `${Error}`) // eslint-disable-line
                throw Error
                
            }
        }
    })
    return ast
}

AstStages.prototype.generateCode = function(parsedAst) {
    const babelGenerator = require('babel-generator');

    let generatedCode = "";
    let outputFunc= babelGenerator.default(parsedAst, generatedCode);
    return outputFunc
}


AstStages.prototype.replaceFile = function(file, generatedCode) {
    const code = generatedCode.code
    fs.writeFileSync(file, code); 
    
    return {
      "file":file,
      "generatedCode": generatedCode
    }
  }


AstStages.prototype.createDocTemplate = function(fn){
    let header =  `*\n * @summary summary of ${fn.name}\n `
    let paramsLiteral = "";
    let stateLiteral = "";
    let returnLiteral = "";
    let templateLiteral;
  
      if ( fn.params.length > 0 ) {
        for ( let p of fn.params ) {
          let param = p.type.replace(/TypeAnnotation/gm, "")
          paramsLiteral +=
           `* @param {${param}} ${p.name} - [description] \n`
        }  
      }
    if ( 
      fn.hasOwnProperty("states") 
      && 
      fn.states.length > 0 
      ) {
        for ( let s of fn.states ) {
          stateLiteral += ` * @argument {type} ${s}  - [description] \n`
        }
    }
    if ( fn.returnedValue ) {
      fn.flow ? returnLiteral = ` * @return {${fn.returnedValue}} - [description] \n `
      : returnLiteral = ` * @return {type} ${fn.returnedValue} - [description] \n` 
    }
    
  
    templateLiteral = header.concat(paramsLiteral, stateLiteral, returnLiteral)
  
    return templateLiteral
}

exports.AstStages = AstStages