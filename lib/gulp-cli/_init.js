'use strict';

var modulePackage = require('gulp/package'),
    cliPackage = require('/usr/lib/node_modules/gulp/package');

var gulp = require('gulp');
var gutil = require('gulp-util');
var runtime = require('../gulp-runtime');
var Herror = require('herro').Herror;

runtime.config({
  cliPackage : cliPackage,
  modulePackage : modulePackage
});

//
// ## something could not be found
//
runtime.on('message', function(opts){

  if( opts.reason !== 'error' ){

    gutil.log(
      gutil.colors.yellow('gulp-runtime') + ': ' +
      opts.message
    );

  } else {

    var err = new gutil.PluginError({
         plugin : 'gulp-runtime',
        message : opts.message
    });
    err.stack = opts.stack;

    err = Herror.call(err, err.message);

    if( opts.throw ){
      throw err;
    } else {

      var logIsSilent = (gutil.log).toString().match(/{.*}/).trim() === '';

      err.stack.split('\n').forEach(function(line){

        if( logIsSilent ){
          console.log(line);
        } else {
          gutil.log(line);
        }
      });
    }
  }

  if( opts.prompt ){
    this.prompt();
  }
});


gulp.doneCallback = function(){
  setTimeout(function(){
    runtime.prompt();
  }, 50);
};
