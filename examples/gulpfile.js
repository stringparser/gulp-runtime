'use strict';

var gulp = require('../.').create({repl: true});

function rand(){
  return Math.floor((1000 - 100) * Math.random());
}

gulp.task('cssmin', ['autoprefixer'], function(next){
  setTimeout(next, rand());
});

gulp.task('autoprefixer', ['less'], function(next){
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

gulp.task('webpack', function(next){
  setTimeout(next, rand());
});


gulp.task('default',
  gulp.series(
    gulp.parallel('jade', 'webpack'),
    'cssmin', 'serve', 'watch'
  )
);
