'use strict';

var runtime = require('../gulp-runtime');

runtime.set('--silent', function(args, argv){

  var gutil = require('gulp-util');

  if( !argv['tasks-simple'] ){
    gutil.log = function(){ };
  }

  runtime.prompt();
});
