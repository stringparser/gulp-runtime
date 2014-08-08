
var gulp = require('gulp');
var gutil = require('gulp-util');
var chalk = gutil.colors;

var runtime = module.exports = new require('runtime').createInterface('gulp');

runtime({ env : process.env });
runtime.require('./gulp-cli');

gulp.on('task_stop', function(){

  process.nextTick(function(){
    runtime.prompt();

    if(!gulp.tasks['watch']){
      console.log(
        chalk.yellow('\n [gulp-runtime] ') + ' No `watch` task defined. Exiting the process.\n'
      );
      process.exit(0);
    }
  })
})

