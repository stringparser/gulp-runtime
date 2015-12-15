'use strict';

var gulp = require('./.').create({repl: true});

function rand(){
  return Math.floor((100 - 1) * Math.random());
}

gulp.task('autoprefixer', function(next){
  setTimeout(next, rand());
});

gulp.task('less', ['autoprefixer'], function(next){
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

gulp.task(['serve'], function webpack(next){
  setTimeout(function(){
    if([0, 1][Math.random() > 0.4 ? 1 : 0]){
      throw new Error('fail!');
    } else {
      next();
    }
  }, rand());
});

gulp.stack(
  'less',
  gulp.stack('webpack', 'jade', {wait: true}),
  'watch'
)();
