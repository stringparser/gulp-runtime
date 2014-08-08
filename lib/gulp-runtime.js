
var gulp = require('gulp');
var chalk = gutil.colors;

var runtime = module.exports = new require('runtime').createInterface('gulp');

runtime({ env : process.env });
runtime.require('./gulp-cli');

gulp.on('task_stop', function(){

  process.nextTick(function(){
    runtime.prompt();

    if(!gulp.tasks['watch']){
      console.log(
        chalk.yellow(' [gulp-runtime] ') + ' No `watch` task defined. Exiting the process.'
      );
      process.exit(0);
    }
  })
})

