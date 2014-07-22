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

  cli.setPrompt(promptText.color, promptText.plain.length)
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
    else if( arg[0] === 'show' )
      if(len !== 2)
        gutil.log('> gulp '
          + gutil.colors.green('show') + ' '
          + gutil.colors.cyan('<taskName>')
          + ' : prints highlighted task sourcode.'
        );
      else
        printTask(arg[1], function onPrintTask(ansiJS){
          console.log(ansiJS)
          cli.prompt();
        });
    else if( cmds[cmd] ){
      cmds[cmd]()
      cli.prompt();
    }
    else
      cli.prompt();

  }.bind(this));

  return cli;
}