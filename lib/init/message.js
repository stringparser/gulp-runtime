'use strict';

var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

//
// ## runtime messages
//

runtime.on('message', function(opts){
  var chalk = util.colors;
  var error = opts.error;
  var message = opts.message
    || chalk.red(error.message) + '\n' + (error.stack);

  if( opts.badge || opts.error ){
    message = util.longBadge + '\n' + message;
  }

  if( opts.stamp ){
    message = message.split('\n')
      .map(function(line){
        return util.stamp() + line;
      }).join('\n');
  }

  if( opts.quotify ){
    message = util.quotify(message, opts.quotify);
  }

  if( runtime.config('env').failed ){
    runtime.output = process.stdout;
  }

  if( opts.throw  ){  throw error;  }
  runtime.output.write( message + '\n' );
  if( opts.prompt ){  runtime.prompt();  }
});
