
var gulp = require('gulp');
var runtime = require('../gulp-runtime');

gulp.doneCallback = function(){

  setTimeout(function(){
    runtime.prompt();
  }, 200);
};
