'use strict';

var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

runtime.set('--silent', function(args, argv){

  runtime.emit('message', {
       tags : ['stamp', 'prompt'],
    message : 'loggin silent'
  });

  if( !argv['tasks-simple'] ){
    util.log = function(){ };
  }
});
