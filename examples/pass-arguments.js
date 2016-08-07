'use strict';

var gulp = require('../.').create();
var path = require('path');

gulp.task('read src', function (callback, src, dest) {
  dest = path.join(dest, new Date().toISOString());
  console.log('from', src, 'to', dest);
  var stream = gulp.src(src);

  callback(null, stream, dest);
});

gulp.task('write', function (done, stream, dest) {
  return stream.pipe(gulp.dest(dest));
});

// the default can take the arguments after '--' from the terminal
gulp.task('default',
  gulp.series('read src', 'write')
);
