var gulp = require('gulp');

process.argv.push('-T')

gulp.task('default', function(){
  console.log('hey!');
})

