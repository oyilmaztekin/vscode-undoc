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

AstTransformMethods.prototype.checkTypeInterfacesFlow = function( props, fn ) {
    for(let p of props) {
        if ( p.value.hasOwnProperty("type") ) {
            if(p.value.hasOwnProperty('id')) {
                    fn.params.push(
                        {
                            "name": p.key.name,
                            "type": p.value.id.name || p.value.id.type
                        }
                    )
            }
            else {
                fn.params.push(
                    {
                        "name": p.key.name,
                        "type": p.value.type || "type"
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
    return fn
}

exports.AstTransformer = AstTransformMethods
