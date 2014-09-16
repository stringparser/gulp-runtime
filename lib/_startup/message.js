'use strict';

var runtime = require('../gulp-runtime');

//
// ## runtime messages
//

runtime.on('message', function(opts){

  var gutil = require('gulp-util');
  var util = require('runtime/lib/utils');
  var chalk = gutil.colors;
  
  if( opts.error ){

    var error = opts.error;
    error = util.Error.call(error, error.message, function(err){

      err.message = util.quotify(
        'in plugin `gulp-runtime`\n\n  '+ err.message,
        chalk
      );

      if( err.stack ){
       err.stack = err.stack.replace(/[ ]+>[ ]+\b/g, function($0){
          return $0.replace('>', chalk.red('>'));
        });
      }
    });

    if( opts.throw ){
      throw error;
    } else {
      console.log(error.stack);
    }

  } else if( opts.message && opts.message.trim() !== '' ){

    opts.message = util.quotify(opts.message || '', chalk);
    console.log(
      ' ['+chalk.yellow('gulp-runtime') + '] ' + opts.message
    );
  }

  if( opts.prompt ){
    runtime.prompt();
  }
});
