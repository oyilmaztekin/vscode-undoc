const fs = require('fs')

const replaceFile = function(file, generatedCode) {
  const code = generatedCode.code
  fs.writeFileSync(file, code); 
  
  return {
    "file":file,
    "generatedCode": generatedCode
  }
}


exports.replaceFile = replaceFile
