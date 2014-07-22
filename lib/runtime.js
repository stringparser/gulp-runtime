
// module dependencies
var readline = require('readline');

// helpers
var stdin = process.stdin
  , stdout = process.stdout
  , cliText;

// default prompt text
exports.cliText = cliText = '> gulp ';

exports.initCli = function initCli(gulp){

  var self = gulp
    , task = gulp.tasks
    , cli = readline.createInterface({
        input : stdin,
        output : stdout
      });

  cli.setPrompt(cliText, cliText.length);

  var utils = require('../utils')
  , childGulp = utils.childGulp
  , printTask = utils.printTask;

  return function runtimeCli(){

    cli.on('line', function(cmd){

      cmd = cmd.trim();
      var arg = cmd.replace(/[ ]+/g, ' ').split(' ')
        , len = arg.length;

      if(cmd[0] === '-')
        childGulp(arg, function(){
          cli.prompt();
        });
      else if( task[arg[0]] )
        gulp.start(arg[0]);
      else if( len === 2 && arg[0] === 'show' )
        printTask(task[arg[1]], arg);
    })

    return cli;
  }
}
