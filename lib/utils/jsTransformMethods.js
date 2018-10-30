const checkReturnedStatementsForJSFiles = function ( activeScope, fn ) {
    if ( activeScope.type === "ReturnStatement" ) {
        activeScope.argument.name 
        ? fn.returnedValue = activeScope.argument.name  
        : fn.returnedValue = activeScope.argument.value || activeScope.argument.type
        fn.returnedValue = fn.returnedValue.toString()
    }
}

const checkStatesForJSFiles = function ( isMemberAssignmentObject, fn ) {
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

exports.checkReturnedStatementsForJSFiles = checkReturnedStatementsForJSFiles
exports.checkStatesForJSFiles = checkStatesForJSFiles