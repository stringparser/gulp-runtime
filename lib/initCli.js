'use strict';

// module dependencies
var readline = require('readline')
  , gulp = require('gulp')
  , gutil = require('gulp-util')
  , childGulp = require('../util/childGulp')
  , printTask = require('../util/printTask')
  , promptText = require('./promptText');

// helpers
var stdin = process.stdin
  , stdout = process.stdout;

module.exports = function initCli(){

  var cli = readline.createInterface({
      input : stdin,
      output : stdout
  })

  cli.setPrompt(promptText, promptText.length)
  cli.on('line', function onCliFlush(cmd){

    cmd = cmd.trim();
    var arg = cmd.replace(/[ ]+/g, ' ').split(' ')
      , len = arg.length
      , cmds = this.getCMD();

    if(cmd[0] === '-')
      childGulp(arg, function onChildGulp(child){
        child.kill();
        cli.prompt();
      });
    else if( gulp.tasks[arg[0]] )
      gulp.start(arg[0]);
    else if( len === 2 && arg[0] === 'show' )
      printTask(arg[1], function onPrintTask(ansiJS){
        console.log(ansiJS)
        cli.prompt();
      });
    else if( cmds[cmd] ){
      console.log(cmd)
    }
    else
      cli.prompt();

  }.bind(this));

  return cli;
}