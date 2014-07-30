
var gulp = require('gulp');
var prettyfy = require('gulp-runtime');

gulp.task('js', function(){
  console.log('js!')
})
gulp.task('css', function(){
  console.log('css!')
})
gulp.task('process', ['css', 'js']);

var runtime = require('../lib/gulp-runtime');

runtime.set('show', function(cmd, args){
  console.log(arguments)
})
