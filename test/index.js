
var gulp = require('gulp');

gulp.task('js', function(){
  console.log('js!')
})
gulp.task('css', function(){
  console.log('css!')
})
gulp.task('process', ['css', 'js']);

var Runtime = require('../lib/runtime');
var runtime = Runtime({
  input : process.stdin,
  output : process.stdout,
  scope : gulp,
  context : gulp.tasks
})

var runtime2 = Runtime({
  input : process.stdin,
  output : process.stdout
})

runtime.setPrompt(' test > gulp ');
runtime.prompt();
runtime.set('show', function(){
  console.log(arguments)
})

