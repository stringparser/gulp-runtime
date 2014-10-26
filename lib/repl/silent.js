'use strict';

var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

var logger = util.log;
runtime.set('--silent', function(argv, args){
  var silent = runtime.config('silent');

  runtime.emit('message', {
    message : silent ? 'logging enabled' : 'logging silent',
      stamp : true,
     prompt : true
  });

  if( silent ){
    silent = false;
    util.log = logger;
  } else if( !args.taskSimple ){
    silent = true;
    util.log = function(){ };
  }
  runtime.config('silent', silent);
});
