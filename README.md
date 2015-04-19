<p align="center">
  an alternate interface to
  <a href="https://github.com/wearefractal/vinyl-fs">
    <b>vinyl-fs</b>
  </a>  
</p>
<p align="center">
  <a href="https://github.com/gulpjs/gulp">
    <img height=275 src="./docs/gulp-runtime.png"/>
  </a>
</p>

[![build][b-build]][x-travis][![NPM version][b-version]][p-gulp-runtime] [![Gitter][b-gitter]][x-gitter]

[install](#getting-started) -
[documentation](#documentation) -
[examples](#examples) -
[implementation status](#implementation-status) -
[license](#license)

````js
'use strict';

var gulp = require('gulp-runtime').create({repl: true});
var util = require('gulp-runtime/util');
var browserSync = require('browser-sync');

var sass = require('gulp-sass');
var concat = require('gulp-concat');
var webpack = require('gulp-webpack');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

var opt = require('./config'); // config opts for plugins

// all js (even if has some jsx)
// webpack will take care of sourcemaps here
gulp.task('js', function(){
  return gulp.src('app/**/*.js')
    .pipe(webpack(opt.webpack))
    .pipe(gulp.dest('build'))
    .once('end', browserSync.reload);
});

// styles with sourcemaps
gulp.task('sass', function(){
  return gulp.src('app/styles/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass()).pipe(autoprefixer()).pipe(concat('bundle.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build'))
    .once('end', browserSync.reload);
});

// general purpose watch|unwatch
var watcher = {};
gulp.task('(watch|unwatch) :glob :tasks((?:\\w+,?)+)', function(next){
  var watch = next.params[0] === 'watch';
  var glob = next.params.glob;
  var tasks = next.params.tasks.split(',');

  if(watch && watcher[glob]){
    util.log('Already watching %s', util.log(glob));
  } else if(watch){
    util.log('Watching %s, tasks after watch %s',
      util.color.yellow(glob),
      util.color.cyan(tasks)
    );
    watcher[glob] = gulp.watch(glob, tasks);
  }

  if(watching[glob]){
    watcher[glob].end();
  } else {
    util.log('No watcher set for `%s`', glob);
    util.log('-'+ Object.keys(watching).join('\n-'));
  }
  next();
});

// browserSync proxy to server
//
function serve(next){
  var server = require('./server');
  var port = server._connectionKey.split(':').pop();
  browserSync({open: false, proxy: 'localhost:'+port});
  // reload browser when html files change
  gulp.watch('build/*.html', browserSync.reload);
  // reload require.cache as server files change, refresh browser
  gulp.watch('server/**/*.js', {reload: true}, browserSync.reload);
  next();
};

// run
//
gulp.stack(serve,
  gulp.stack('watch app/styles/*.scss sass watch app/js/*.js js'),
  {wait: true}
)();
````

## todo

 - [ ] improve the docs

## license

[![License][b-license]][x-license]

[x-npm]: https://www.npmjs.org
[x-gulp]: https://github.com/gulpjs/gulp
[x-gulp-cli]: https://github.com/gulpjs/gulp/blob/master/docs/CLI.md

[x-gitter]: https://gitter.im/stringparser/gulp-runtime
[x-travis]: https://travis-ci.org/stringparser/gulp-runtime/builds
[x-license]: http://opensource.org/licenses/MIT
[x-issues-new]: https://github.com/stringparser/gulp-runtime/issues/new

[b-build]: http://img.shields.io/travis/stringparser/gulp-runtime/master.svg?style=flat-square
[b-gitter]: https://badges.gitter.im/Join%20Chat.svg
[b-version]: http://img.shields.io/npm/v/gulp-runtime.svg?style=flat-square
[b-license]: http://img.shields.io/npm/l/gulp-runtime.svg?style=flat-square
