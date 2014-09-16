'use strict';

var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

//
// ## runtime messages
//

runtime.on('message', function(opts){

  var chalk = util.colors;

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

    return ;

  } else if(opts.message) {

    if( !opts.stamp ){
      console.log(
        '['+chalk.yellow('gulp-runtime') + ']',
        util.quotify(opts.message, chalk)
      );

    } else {
      opts.message.split('\n').forEach(function(line){
        util.log( util.quotify(line, chalk) );
      });
    }
  }

  if( opts.prompt ){
    runtime.prompt();
  }
});