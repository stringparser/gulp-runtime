
var gulp = require('gulp');
var gutil = require('gulp-util');
var chalk = gutil.colors;

var runtime = module.exports = (
  new require('../../../runtime').createInterface('gulp')
);

runtime({ env : process.env });
runtime.require('./gulp-cli');

gulp.once('task_stop', function(){
  process.nextTick(function(){
    runtime.setPrompt(' > gulp ');
  })
})

gulp.on('task_stop', function(){
  process.nextTick(function(){
    runtime.prompt();
  })
})