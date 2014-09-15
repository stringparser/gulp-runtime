'use strict';


var gutil = require('gulp-util');
var util = require('runtime/lib/utils');
var runtime = require('../gulp-runtime');

var chalk = gutil.colors;


//
// ## runtime messages
//

runtime.on('message', function(opts){

  if( !opts.error ){

    opts.message = (opts.message || '').replace(/(`|'|")(\S+)(`|'|")/g,
      function($0,$1,$2,$3){
        return $1 + chalk.cyan($2) + $3;
      }
    );

    if( opts.message && opts.message.trim() !== '' ){
      console.log(
        ' ['+chalk.yellow('gulp-runtime') + '] ' +
        opts.message
      );
    }

  } else {

    var err = opts.error;

    util.Error.call(err, err.message, function(error){

      error.message = new gutil.PluginError({
           plugin : 'gulp-runtime',
          message : err.message
      });

    });

    if( opts.throw ){
      throw err;
    }

    if(err.stack){

      var logIsSilent = (
          gutil.log+''
        ).replace(/\n/g, '')
         .match(/{(.*)}/)[1].trim() === '';

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
    runtime.prompt();
  }
});
