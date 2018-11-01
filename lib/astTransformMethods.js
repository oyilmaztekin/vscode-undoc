function AstTransformMethods() {}

AstTransformMethods.prototype.checkParameterTypeForFlow = function( params, fn ) {
    let variableType
    
    for ( let p of params ) {
        if(p.hasOwnProperty('typeAnnotation')){
            p.typeAnnotation.typeAnnotation.hasOwnProperty("id") 
            ? variableType = p.typeAnnotation.typeAnnotation.id.name 
            : variableType = p.typeAnnotation.typeAnnotation.type
        }
        fn.params.push(
            {
                "name": p.name,
                "type": variableType || "type"
            }
            )
        }   
        
    return variableType
}

AstTransformMethods.prototype.checkReturnedTypeForFlow = function ( node, fn ) {
    let returnedValue
    if ( node.returnType.hasOwnProperty("typeAnnotation") ) {
        node.returnType.typeAnnotation.hasOwnProperty("id")
        ? fn.returnedValue = node.returnType.typeAnnotation.id.name
        : fn.returnedValue = node.returnType.typeAnnotation.type
        
        fn.flow = true
    }
    return returnedValue 
}

AstTransformMethods.prototype.checkReturnedStatementsForJSFiles = function ( activeScope, fn ) {
    if ( activeScope.type === "ReturnStatement" ) {
        activeScope.argument.name 
        ? fn.returnedValue = activeScope.argument.name  
        : fn.returnedValue = activeScope.argument.value || activeScope.argument.type
        fn.returnedValue = fn.returnedValue.toString()
    }
}

AstTransformMethods.prototype.checkStatesForJSFiles = function ( isMemberAssignmentObject, fn ) {
    if (isMemberAssignmentObject) {
        if ( isMemberAssignmentObject.hasOwnProperty("left") ) {
            if ( isMemberAssignmentObject.left.hasOwnProperty("property") ) {
                if ( isMemberAssignmentObject.left.property.name === "state" ) {
                    const props = isMemberAssignmentObject.right.properties
                    for( let key in props ) {
                        fn.states.push(props[key].key.name)
                    }
                }
            }
        }
    }
}

exports.AstTransformer = AstTransformMethods