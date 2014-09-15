'use strict';


var gutil = require('gulp-util');
var util = require('runtime/lib/utils');
var runtime = require('../gulp-runtime');

var chalk = gutil.colors;


//
// ## runtime messages
//

runtime.on('message', function(opts){

  if( opts.error ){

    var error = opts.error;
    error = util.Error.call(error, error.message, function(err){

      err.message =
      'in plugin `'+chalk.cyan('gulp-runtime')+'`\n\n  '+
      err.message;

      err.stack = (
        err.stack || ''
      ).replace(/[ ]+>[ ]+\b/g, function($0){
        return $0.replace('>', chalk.red('>'));
      });
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
