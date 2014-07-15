var gupl = require('gulp');

gulp.task('default', function(){
  console.log('hello '+process.argv);
})

process.stdin.resume();
process.stdin.on('data', function(chunk){
  console.log(chunk)
})