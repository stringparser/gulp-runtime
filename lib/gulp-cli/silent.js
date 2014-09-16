'use strict';

var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

runtime.set('--silent', function(args, argv){

  if( !argv['tasks-simple'] ){
    util.log = function(){ };
  }

  runtime.prompt();
});
