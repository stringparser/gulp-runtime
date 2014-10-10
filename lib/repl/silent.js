'use strict';

var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

runtime.set('--silent', function(args, argv){

  runtime.emit('message', {
    stamp : true,
    prompt : true,
    message : 'loggin silent'
  });

  if( !argv['tasks-simple'] ){
    util.log = function(){ };
  }
});
