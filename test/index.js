
var gulp = require('gulp');
var prettyfy = require('../util/prettyfy');

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
