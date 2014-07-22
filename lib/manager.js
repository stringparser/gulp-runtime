
// module dependencies
var utils = require('../utils')
  , childGulp = utils.childGulp
  , promptText = utils.promptText
  , printTask = utils.printTask;

// helpers
var stdout = process.stdout;

// runtime wrapper
module.exports = function handle(gulp){



// chunk manager
// - return false if chunk doesn't pass
  return function manager(chunk){

    var args = chunk.trim().replace(/[ ]+/g, ' ').split(' ')
      , len = args.length;

    if(args[0][0] === '-')
      childGulp(args);
    else if(task[args[0]])
      gulp.start(args[0]);
    else if(len === 2 && args[0] === 'show')
      printTask(task[args[1]], args);
    else {
      var arg = '"' + args[0].trim() + '"';
    }

    return '';
  }
}

