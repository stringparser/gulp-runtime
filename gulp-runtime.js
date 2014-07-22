'use strict';

// Module dependencies
var gutil = require('gulp-util')
  , init = require('./lib').init;

// Expose `runtime`
module.exports = function runtime(gulp){

  var runtime = init(gulp);

  return runtime;
}