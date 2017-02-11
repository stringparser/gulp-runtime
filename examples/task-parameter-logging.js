'use strict';

var gulp = require('../.').create();

gulp.task(':one', function (done) {
  setTimeout(done, 120);
});

gulp.task('default', gulp.series('one', 'two'));
