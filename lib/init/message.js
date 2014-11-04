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
    || chalk.red(opts.error.message);

  if( opts.badge || opts.error ){
    message = util.longBadge + '\n' + message;
  }

  if( opts.stamp ){
    message = message
      .split('\n')
      .map(function(line){
        return util.stamp() + line;
      }).join('\n');
  }

  if( opts.quotify){
    message = util.quotify(message, opts.quotify);
  }

  var env = runtime.config('env');
  console.log(opts);
  if( env.failed && !runtime.output.isTTY ){
    runtime.output.pipe(process.stdout);
  }
  runtime.output.write(message+'\n');

  if( opts.throw  ){  throw error;  }
  if( opts.error  ){  runtime.output.write(error.stack+'\n');  }
  if( opts.prompt ){  runtime.prompt();  }
  if( opts.exit ){ process.exit(env.failed ? 1 : 0); }
});
