'use strict';

var runtime = require('./.');
var gulp = require('gulp');

runtime.startup(function startupChange(){
  this.setPrompt(' dev > ');
});

gulp.task('less', function(){ });
gulp.task('css', function(){ });
gulp.task('compress', function(){ });

gulp.task('default', ['less', 'css', 'compress']);