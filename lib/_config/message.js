'use strict';

var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

//
// ## runtime messages
//

runtime.on('message', function(opts){

  var chalk = util.colors;

  if( opts.stamp ){
    util.log( opts.error ? '' : util.badge );
  }

  if( opts.error ){

    var error = opts.error;
    error = util.Error.call(error, error.message, function(err){

      err.message = util.quotify(
        'in plugin `'+util.badge+'`\n\n  ' + err.message
      );

      if( err.stack ){
        err.stack = err.stack.replace(/[ ]+>[ ]+\b/g,
          function($0){
            return $0.replace(/>/g, chalk.red('>'));
          });
      }
    });

    if( opts.throw ){
      throw error;
    }
    console.log(error.stack);

  }

  if( opts.message ) {
    console.log(
      util.quotify(opts.message)
    );
  }

  if( opts.prompt ){
    runtime.prompt();
  }
});
