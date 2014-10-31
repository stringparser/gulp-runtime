'use strict';

var runtime = require('runtime').get('gulp');

runtime.set('--silent', function(argv, args){
  var silent = runtime.config('env').silent;

  runtime.emit('message', {
    message : silent ? 'logging enabled' : 'logging silent',
      stamp : true,
     prompt : true
  });

  if( !args.tasksSimple ){
    silent = true;
  } else {
    silent = false;
  }

  runtime.config('env', { silent : silent });
});
