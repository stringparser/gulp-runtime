var gulp = require('./runtime');
var gutil = require('gulp-util');

gulp.task('default', function(){
  gutil.log(' > default')
})
gulp.task('css', logger)
gulp.task('js', logger)
gulp.task('process', ['css', 'js'], logger)



//
// test function
var logger = function (args){

  console.log('hey')
}