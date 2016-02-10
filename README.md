## gulp-runtime [![NPM version][badge-version]][x-npm] [![downloads][badge-downloads]][x-npm]

[![build][badge-build]][x-travis]
[![Gitter][badge-gitter]][x-gitter]

> an alternate interface to [vinyl-fs][p-vinylFs]

[install](#install) -
[examples](#examples) -
[why](#why) -
[license](#license)

## documentation

For more information go to the [documentation folder](./docs).

## sample

repl, path-to-regex mapping and async composition

````js
var gulp = require('gulp-runtime').create({repl: true});
var util = require('gulp-runtime/util');
var browserSync = require('browser-sync');

var sass = require('gulp-sass');
var concat = require('gulp-concat');
var webpack = require('gulp-webpack');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

var opt = require('./config'); // config opts for plugins

// general purpose watch|unwatch
var watcher = {};
gulp.task('(watch|unwatch) :glob :tasks((?:\\w+,?)+)', function(next){
  var watch = next.params[0] === 'watch';
  var glob = next.params.glob;
  var tasks = next.params.tasks.split(',');

  if(watch && watcher[glob]){
    util.log('Already watching %s', util.log(glob));
  } else if(watch){
    util.log('Watching %s, tasks after watch \'%s\'',
      util.color.yellow(glob),
      util.color.cyan(tasks)
    );
    watcher[glob] = gulp.watch(glob, tasks);
  } else if(watcher[glob]){
    watcher[glob].end();
  } else {
    util.log('No watcher set for `%s`', glob);
    util.log('-'+ Object.keys(watcher).join('\n-'));
  }
  next();
});

// all js (even if has some jsx)
// webpack takes care of sourcemaps and jsx transpiling here
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

// proxy server using browserSync
function serve(next){
  var server = require('./server');
  var port = server.http._connectionKey.split(':').pop();
  // proxy server with browserSync
  browserSync({open: false, proxy: 'localhost:'+port});
  // reload browser when html files change
  gulp.watch('build/*.html', browserSync.reload);
  // reload require.cache for these and reload the browser
  gulp.watch('server/**/*.js', {reload: true}, browserSync.reload);
  next();
}

// run
var watching = gulp.stack('watch app/styles/*.scss sass watch app/js/*.js js');
gulp.stack(serve, watching, {wait: true})(/* pass arguments here */);
````
> complete code can be found [here][x-app-template]

to run it, do just like any other node program

```sh
$ node gulpfile.js
[23:31:54] Using ~/code/app-template/gulpfile.js
[23:31:54] Started 'serve watch app/styles/*.scss sass watch app/js/*.js js' in series
[23:31:56] Finished 'serve' after 2.19 s
[23:31:56] Watching app/styles/*.scss, tasks after watch 'sass'
[23:31:56] Finished 'watch app/styles/*.scss sass' after 27 ms
[23:31:56] Watching app/js/*.js, tasks after watch 'js'
[23:31:56] Finished 'watch app/js/*.js js' after 1.44 ms
[23:31:56] Finished 'serve watch app/styles/*.scss sass watch app/js/*.js js' after 2.22 s
[BS] Proxying: http://localhost:8000
[BS] Access URLs:
 ------------------------------------
       Local: http://localhost:3000
    External: http://192.168.1.3:3000
 ------------------------------------
          UI: http://localhost:3001
 UI External: http://192.168.1.3:3001
 ------------------------------------
>
```

Press

1. <kbd>Enter</kbd> to see the prompt
1. write the tasks you want to run
1. or <kbd>Tab</kbd> to see completion

for example, the [gulp cli][x-gulp-cli] is available for every instance. To see all commands available write an hypen and press tab

```sh
> - (Press Tab)
--silent        --cwd           --no-color
--color         --tasks-simple  --tasks
-T              --require       --gulpfile
```

## examples

For now you can look at the code at the [app-template][x-app-template] repo. Do not hesitate to [create a new issue][x-new-issue] with any comments or directly go to [gitter][x-gitter] and ask there directly. I'll be giving more code examples on the comming weeks.

## why

This started as repl for gulp with a simple interface (completion and cli commands). But it was somewhat limited by how functions were composed at runtime and how you could run a functions previously set. As the project grew I wanted to be able to have more control over task definition and execution. To make this happen:

 - [parth][p-parth] path-to-regex madness
 - [tornado][p-tornado] composing asynchronous functions
 - [tornado-repl][p-tornado-repl] a repl for tornado

So now the project puts together this things learnt for [vinyl-fs][p-vinylFs] giving an alternate interface for it.

## install

With [npm](http://www.npmjs.com)

```sh
npm install gulp-runtime
```

## license

[![License][badge-license]][x-license]

<!-- links -->

[x-npm]: https://npmjs.com/gulp-runtime
[x-gitter]: https://gitter.im/stringparser/gulp-runtime
[x-travis]: https://travis-ci.org/stringparser/gulp-runtime/builds
[x-license]: http://opensource.org/licenses/MIT
[x-new-issue]: https://github.com/stringparser/gulp-runtime/issues/new

[badge-build]: http://img.shields.io/travis/stringparser/gulp-runtime/master.svg?style=flat-square
[badge-gitter]: https://badges.gitter.im/Join%20Chat.svg
[badge-version]: http://img.shields.io/npm/v/gulp-runtime.svg?style=flat-square
[badge-license]: http://img.shields.io/npm/l/gulp-runtime.svg?style=flat-square
[badge-downloads]: http://img.shields.io/npm/dm/gulp-repl.svg?style=flat-square
