
// module dependencies
var readline = require('readline')
  , utils = require('../utils')
  , childGulp = utils.childGulp
  , printTask = utils.printTask;

// helpers
var stdin = process.stdin
  , stdout = process.stdout
  , cliText;

// default prompt text
exports.cliText = cliText = ' > gulp ';

exports.initCli = function initCli(gulp){

  var self = gulp
    , task = gulp.tasks
    , cli = readline.createInterface({
        input : stdin,
        output : stdout
      });

  cli.setPrompt(cliText, cliText.length);
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

/*stdin
  .pipe(
    plumber.map(function(chunk){
      buff += chunk;
      return chunk;
    })
  )
  .pipe(
    plumber.map(function(chunk){

      if(chunk === '\r'){
        chunk += '\n' + cliText;
        buff = ' ';
      }
      else if(chunk === '\u0003'){  // ctrl+c
        chunk = '';
        process.exit();
      }
      else if(chunk === '\f'){      // ctrl+l{
        buff = '';
        return '\u001B[2J\u001B[0;0f' + cliText;
      }
      else
        buff += chunk;

      return chunk;
    })
  )
  .pipe(process.stdout);*/