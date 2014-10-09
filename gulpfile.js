'use strict';

var gulp = require('gulp');
var runtime = require('./.');

console.log(process.execArgv);
console.log(process.argv);

var testTasks = ['lint', 'jade', 'stylus', 'js', 'jsx'];
testTasks.forEach(function(name){
  gulp.task(name, function(){

  });
});

var browdeps = ['js', 'jsx'];
gulp.task('browserify', browdeps, function(){

  console.log('updated!')
});
// build everything and open main entry page
gulp.task('default', testTasks.slice(0, 3).concat('browserify'), function () {
    // ...
});
