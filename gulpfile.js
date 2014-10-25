'use strict';

var Q = require('q');
var runtime = require('./.');
var gulp = require('gulp');

gulp.task('less', ['css'], function(){
  var deferred = Q.defer();

  // do async stuff
  setTimeout(function() {
    deferred.resolve();
  }, 150);

  return deferred.promise;
});
gulp.task('css', function(){
  var deferred = Q.defer();
  // do async stuff
  setTimeout(function() {
    deferred.resolve();
  }, 20);
});
gulp.task('compress', function(){
  var deferred = Q.defer();
  // do async stuff
  setTimeout(function() {
    deferred.resolve();
  }, 1000);

  return deferred.promise;
});

gulp.task('default', ['less', 'compress']);
