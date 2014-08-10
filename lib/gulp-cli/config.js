
var gulp = require('gulp');
var runtime = require('../gulp-runtime');


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