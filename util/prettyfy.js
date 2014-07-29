
/*
 * Pretty printer for objects
 */
var ansiJS = require('ansi-highlight');

var prettyfy = exports = module.exports = {}

prettyfy.str = function(obj){

  return JSON.stringify( obj ,
    function (key, value){

      if(typeof value === 'function')
        return  value.toString();
      else if(typeof value === 'string')
        return '\''+value+'\'';
      else
        return value;

    }, '   ').replace(/\"/g, '')
             .replace(/\\\\n/g,'<n>')
             .replace(/\\n/g, '\n')
             .replace(/\<n\>/g, '\\n')
}

prettyfy.log = function(obj){
  var str = prettyfy.str(obj);
  console.log(str);
}

prettyfy.color = function(obj){
  var str = prettyfy.str(obj);
      str = ansiJS(str);

  console.log(str);
}

