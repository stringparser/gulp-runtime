'use strict';

/*
 *
 */

var gulp = require('gulp');
var gutil = require('gulp-util');
var tildify = require('tildify');
var chalk = gutil.colors;

var modulePackage,
    cliPackage = require('/usr/lib/node_modules/gulp/package');

try {
  modulePackage = require('gulp/package');
} catch(e){

  var env = process.env;

  gutil.log(
    chalk.red('Local gulp not found in'),
    chalk.magenta(tildify(env.cwd))
  );

  gutil.log(chalk.red('Try running: npm install gulp'));
  process.exit(1);
}

var runtime = require('../gulp-runtime');

runtime.config({
  cliPackage : cliPackage,
  modulePackage : modulePackage
});

runtime.on('notFound', function(opts, message){

  gutil.log( chalk.yellow('gulp-runtime') + ':' + message );  

  if( opts.prompt ){
    this.prompt();
  }
});


gulp.doneCallback = function(){
  setTimeout(function(){
    runtime.prompt();
  }, 50);
};
