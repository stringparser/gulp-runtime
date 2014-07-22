'use strict';

// module dependencies
var readline = require('readline')
  , gulp = require('gulp')
  , childGulp = require('../util/childGulp')
  , printTask = require('../util/printTask')
  , promptText = require('./promptText');

// helpers
var stdin = process.stdin
  , stdout = process.stdout

module.exports = function initCli(){

  var cli = readline.createInterface({
      input : stdin,
      output : stdout
  })

  cli.setPrompt(promptText, promptText.length)
  cli.on('line', onCliFlush);

  return cli;
}

function onCliFlush(cmd){

  cmd = cmd.trim();
  var arg = cmd.replace(/[ ]+/g, ' ').split(' ')
    , len = arg.length;

  if(cmd[0] === '-')
    childGulp(arg, function onChildGulp(child){
      child.kill();
      cli.prompt();
    });
  else if( gulp.tasks[arg[0]] )
    gulp.start(arg[0]);
  else if( len === 2 && arg[0] === 'show' )
    printTask(arg[1], function onPrintTask(ansiJS){
      cli.write(ansiJS);
      cli.prompt();
    });
  else{
    cli.write(gulp);
    cli.prompt();
  }
}