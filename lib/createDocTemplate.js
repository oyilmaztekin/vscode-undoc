let createDocTemplate = function(fn){
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

exports.createDocTemplate = createDocTemplate