
/*
 * module dependencies
 */
var Runtime = require('../lib/runtime');

// on `tab` completer
// structure taken from node's documentation
module.exports = function completerFn(line){

  var completions = Interface.prototype.get();

  if(completions.length !== 0){
    var hits = completions.filter(function(c) {
        return c.indexOf(line) == 0;
      });
    // show all completions if none found
    return [hits.length ? hits : completions, line];
  }
  else
    return [ [''], line];
}