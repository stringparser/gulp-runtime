
/*
 * Pretty printer for objects
 */
var ansiJS = require('ansi-highlight');

module.exports = function prettyfy(obj){

  return ansiJS(
    JSON.stringify(obj, function(key, value){
      if(typeof value === 'function'){
        return  ''+value;
      }
      else
        return value;
    }, '  ').split(/\\n/g).join('\n')
  );
}