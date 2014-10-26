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
    message = 'From plugin `'+util.badge+'`\n' + message;
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
  runtime.output.write(message+'\n');

  if( opts.throw  ){  throw error;  }
  if( opts.error ){   runtime.output.write(error.stack+'\n');  }
  if( opts.prompt ){  runtime.prompt();  }
});
