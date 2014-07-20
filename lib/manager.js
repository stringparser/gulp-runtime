
// module dependencies
var childGulp = require('../utils').childGulp;

// chunk handler
// - return false if chunk doesn't pass
module.exports = function(runtime){

  var task = runtime.instance.tasks;

  return function manager(chunk){

    var args = chunk.trim().replace(/[ ]+/g, ' ').split(' ')
      , arg = args[0];

    if(arg[0] === '-')
      chunk = childGulp(args);
    else if(task[arg])
      chunk = JSON.stringify(
        task[arg[0]], null, '\t'
      );

    task[arg] ? console.log(' task :', chunk) : false;

    return chunk ? chunk : '';
  }
}