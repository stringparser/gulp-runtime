var gulp = require('gulp');
var gutil = require('gulp-util');
var runtime = require('./gulp-runtime');

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