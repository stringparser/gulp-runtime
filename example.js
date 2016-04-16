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

gulp.task('webpack', function(next){
  setTimeout(next, rand());
});

gulp.start('less', gulp.series('webpack', 'jade'), 'watch');
