
// module dependencies
var utils = require('../utils')
  , childGulp = utils.childGulp
  , promptText = utils.promptText;

// helpers
var stdout = process.stdout;

// chunk handler
// - return false if chunk doesn't pass
module.exports = function(runtime){

  var gulp = runtime.instance;
  var task = gulp.tasks;

  return function manager(chunk){

    var args = chunk.trim().replace(/[ ]+/g, ' ').split(' ')
      , arg = args[0];

    if(arg[0] === '-'){
      var child = childGulp(args);

      // don't keep parent process waiting
      child.stdin.end();
      // Handle output
      child.stdout.on('data', function(chunk){
        stdout.write(chunk);
      }).on('end', function(){
        stdout.write(promptText);
        child.kill();
      })

      chunk = false;
    }
    else if(task[arg]){

      stdout.write('\n');
      gulp.start(arg);
      chunk = promptText;
    }
    else if(args.length === 2 && arg === 'show'){
      arg = args[1];
      chunk = (
        'gulp.task(\'' + arg + '\',' + (task[arg].fn).toString() + ');\n'+promptText
      );
    }
    else {

      arg = JSON.stringify(arg).replace(/\n/g,'');
      stdout.write( arg + ' not a defined command');

      chunk = '\n' + promptText;
    }

    return chunk ? chunk : '';
  }
}