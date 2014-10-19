'use strict';

var runtime = require('./.');
    runtime.config({ prompt : '', repl : true });
var gulp = require('gulp');

gulp.task('less', function(){ });
gulp.task('css', function(){ });
gulp.task('compress', function(){ });

gulp.task('default', ['less', 'css', 'compress']);
