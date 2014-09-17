'use strict';

var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

//
// ## runtime messages
//

runtime.on('message', function(opts){

  var chalk = util.colors;
  var date = util.date;

  if( opts.stamp ){
    opts.message = '[' +
        chalk.grey(date(new Date(), 'HH:MM:ss')) +
      '] ' + opts.message;
  }

  if( opts.error ){

    var error = opts.error;
    error = util.Error.call(error, error.message, function(err){

      err.message = util.quotify(
        'in plugin `'+util.badge+'`\n\n  ' + err.message, opts.quotify
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
      util.quotify(opts.message, opts.quotify)
    );
  }

  if( opts.prompt ){
    runtime.prompt();
  }
});
