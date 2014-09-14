'use strict';

var modulePackage = require('gulp/package'),
    cliPackage = require('/usr/lib/node_modules/gulp/package');

var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var chalk = gutil.colors;

var util = require('runtime/lib/utils');
var runtime = require('../gulp-runtime');

var argv = util.args(process.argv.slice(2));

if( !argv.gulpfile ){
  argv.gulpfile = path.resolve('.', 'gulpfile.js');
}

runtime.config({
           argv : argv,
     cliPackage : cliPackage,
  modulePackage : modulePackage
});

//
// ## something could not be found
//
runtime.on('message', function(opts){

  if( !opts.error && opts.message ){

    opts.message = (opts.message || '').replace(/(`|'|")(\S+)(`|'|")/g,
      function($0,$1,$2,$3){
        return $1 + chalk.cyan($2) + $3;
      }
    );

    gutil.log(
      chalk.yellow('gulp-runtime') + ': ' +
      opts.message
    );

  } else {

    var err = opts.err;

    util.Error.call(err, err.message, function(error){

      error.message = new gutil.PluginError({
           plugin : 'gulp-runtime',
          message : err.message
      });

    });

    if( opts.throw ){
      throw err;
    }

    var logIsSilent = (gutil.log).toString();
        logIsSilent = logIsSilent.match(/{(.*)}/)[1].trim() === '';

    if(err.stack){

      err.stack.split('\n').forEach(function(line){
        if( logIsSilent ){
          console.log(line);
        } else {
          gutil.log(line);
        }
      });
    }

  }

  if( !opts.throw && opts.prompt ){
    runtime.prompt();
  }
});


gulp.doneCallback = function(){
  setTimeout(function(){
    runtime.prompt();
  }, 50);
};
