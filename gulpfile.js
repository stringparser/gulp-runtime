var gulp = require('gulp');
var runtime = require('./lib/runtime')(gulp);

gulp.task('default', function(){
  console.log('hey!');
})

