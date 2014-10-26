'use strict';

var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

var logger = util.log;

runtime.set('--silent', function(argv, args){
  var silent = runtime.config('env').silent;

  runtime.emit('message', {
    message : silent ? 'logging enabled' : 'logging silent',
      stamp : true,
     prompt : true
  });

  if( !args.tasksSimple ){  silent = true;  }
  else { util.log = logger; }

  runtime.config('env', { silent : silent });
});
