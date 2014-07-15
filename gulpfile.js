var gulp = require('gulp');

gulp.task('default', function(){
  console.log(process.argv);
})


process.stdin.on('data', function(chunk){
  console.log('gulp says : ', chunk.toString())
})