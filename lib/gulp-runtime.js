
var gulp = require('gulp');
var gutil = require('gulp-util');
var chalk = gutil.colors;

var runtime = module.exports = new require('./runtime').Runtime('gulp');

runtime({ env : process.env });
require('./gulp-cli/version')
gulp.doneCallback = function(){
  runtime.prompt();
  gulp.doneCallback = undefined;
}
