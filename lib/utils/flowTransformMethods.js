const checkParameterTypeForFlow = function ( params, fn ) {
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
    
const checkReturnedTypeForFlow = function(node, fn) {
    let returnedValue
    if ( node.returnType.hasOwnProperty("typeAnnotation") ) {
        node.returnType.typeAnnotation.hasOwnProperty("id")
        ? fn.returnedValue = node.returnType.typeAnnotation.id.name
        : fn.returnedValue = node.returnType.typeAnnotation.type
        
        fn.flow = true
    }
    return returnedValue 
}
    
    
exports.checkParameterTypeForFlow = checkParameterTypeForFlow
exports.checkReturnedTypeForFlow = checkReturnedTypeForFlow