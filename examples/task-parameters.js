'use strict';

var gulp = require('../.').create();

gulp.task('build :src :dest', function () {
  return gulp.src(this.params.src)
    // transform, compress, etc.
    .pipe(gulp.dest(this.params.dest));
});

gulp.task('default',
  gulp.parallel('build src/**/*.js build')
);
