'use strict';

var gulp = require('../.').create();

function build (done, src, dest) {
  console.log('from', src, 'to', dest);
  return gulp.src(src)
    // some build step
    .pipe(gulp.dest(dest));
}

function minify (done, src, dest) {
  return gulp.src(src)
    // minify
    .pipe(gulp.dest(dest));
}

gulp.task('default',
  gulp.series(build, minify)
);
