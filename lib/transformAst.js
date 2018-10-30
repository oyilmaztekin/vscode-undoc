const traverse = require('babel-traverse').default
const createDocTemplate = require('./createDocTemplate').createDocTemplate
const checkParameterTypeForFlow = require('./utils/flowTransformMethods').checkParameterTypeForFlow
const checkReturnedTypeForFlow = require('./utils/flowTransformMethods').checkReturnedTypeForFlow
const checkReturnedStatementsForJSFiles = require('./utils/jsTransformMethods').checkReturnedStatementsForJSFiles
const checkStatesForJSFiles = require('./utils/jsTransformMethods').checkStatesForJSFiles

const transformToAst = function(ast){
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
                    checkParameterTypeForFlow(params, fn)
                }
                
                for( let b in blockScope ){
                    const activeScope = blockScope[b]
                    if ( !node.hasOwnProperty('returnType') ) {
                        checkReturnedStatementsForJSFiles(activeScope, fn)
                    }
                    else {
                        checkReturnedTypeForFlow(node, fn)
                    }
                }
                
                let processedTemplate = createDocTemplate(fn)
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
                
                let processedTemplate = createDocTemplate(fn)
                
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
                    
                    checkParameterTypeForFlow( params, fn )
                    
                    const blockScope = node.body.body
                    
                    for( let b in blockScope ) {
                        const activeScope = blockScope[b]

                        if ( !node.hasOwnProperty('returnType') ) {
                            checkReturnedStatementsForJSFiles(activeScope, fn)
                        }

                        else {
                            checkReturnedTypeForFlow(node, fn)
                        }
                        
                        const isMemberAssignmentObject = activeScope.expression

                        checkStatesForJSFiles( isMemberAssignmentObject, fn )
                        
                    }
                    
                    let processedTemplate = createDocTemplate(fn)
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

exports.transformToAst = transformToAst