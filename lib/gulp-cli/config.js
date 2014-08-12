
var gulp = require('gulp');
var runtime = require('../gulp-runtime');


gulp.once('task_stop', function(){
  process.nextTick(function(){
    runtime.setPrompt(' > gulp ');
  })
})

gulp.doneCallback = function(){
  process.nextTick(function(){
    runtime.prompt();
  })
}