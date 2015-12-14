'use strict';

var gulp = require('./.').create({repl: true});

function rand(){
  return Math.floor((10000 - 1) * Math.random());
}

gulp.task('webpack', function(next){
  setTimeout(next, rand());
});

gulp.task('less', function(next){
  setTimeout(next, rand());
});

gulp.task('jade', function(next){
  setTimeout(next, rand());
});

gulp.task('serve', function(next){
  setTimeout(next, rand());
});

gulp.task('watch', function(next){
  setTimeout(next, rand());
});

gulp.stack(
  'serve', 'less',
  gulp.stack('webpack', 'jade', {wait: true}),
  'watch'
)();
