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

  console.log(util.quotify(message, opts.quotify));

  if( opts.throw  ){  throw error;  }
  if( opts.error ){  console.log(error.stack);  }
  if( opts.prompt ){  runtime.prompt();  }
});
