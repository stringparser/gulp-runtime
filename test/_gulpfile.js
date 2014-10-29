'use strict';

var runtime = require('../');
var Q = require('q');
var gulp = require('gulp');

gulp.task('one', function(){
  var deferred = Q.defer();
  setTimeout(function() {
    deferred.resolve();
  }, 100);
  return deferred.promise;
});
gulp.task('two', function(){ });
gulp.task('three', function(){ });

gulp.task('default', ['one', 'two', 'three']);
