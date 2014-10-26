'use strict';

require('./.');
var gulp = require('gulp');

gulp.task('one', function(){ });
gulp.task('two', function(){ });
gulp.task('three', function(){ });

gulp.task('default', ['one', 'two', 'three']);
