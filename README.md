## gulp-runtime [![build][b-build]][x-travis][![NPM version][b-version]][p-gulp-runtime] [![Gitter][b-gitter]][x-gitter]

> an alternate interface to [vinyl-fs][p-vinylFs]

[install](#install) -
[examples](#examples) -
[why](#why) -
[license](#license)

## documentation

For more information go to the [documentation folder](./docs).

## sample

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
gulp.stack(serve,
  gulp.stack('watch app/styles/*.scss sass watch app/js/*.js js'),
  {wait: true}
)();
````
> server code can be found [here][x-app-template]

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

Press:

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

## install

With [npm][x-npm]

```sh
npm install gulp-runtime
```

## license

[![License][b-license]][x-license]

<!-- links
  b-: is for badges
  p-: is for package
  t-: is for doc's toc
  x-: is for just a link
-->

[x-npm]: https://www.npmjs.org

[p-vinylFs]: https://github.com/wearefractal/vinyl-fs
[p-vinylFs.src]: https://github.com/wearefractal/vinyl-fs#srcglobs-opt
[p-vinylFs.dest]: https://github.com/wearefractal/vinyl-fs#destfolder-opt
[p-vinylFs.watch]: https://github.com/wearefractal/vinyl-fs#watchglobs-opt-cb
[t-stack]: https://github.com/stringparser/tornado/blob/master/docs/stack.md

[p-parth]: https://github.com/stringparser/parth
[p-tornado]: https://github.com/stringparser/tornado
[p-tornado-repl]: https://github.com/stringparser/tornado-repl
[m-readline]: https://nodejs.org/api/readline.html
[p-gulp-runtime]: https://npmjs.com/gulp-runtime

[x-app-template]: https://github.com/stringparser/app-template

[x-gulp-cli]: https://github.com/gulpjs/gulp/blob/master/docs/CLI.md

[x-gitter]: https://gitter.im/stringparser/gulp-runtime
[x-travis]: https://travis-ci.org/stringparser/gulp-runtime/builds
[x-license]: http://opensource.org/licenses/MIT
[x-new-issue]: https://github.com/stringparser/gulp-runtime/issues/new

[b-build]: http://img.shields.io/travis/stringparser/gulp-runtime/master.svg?style=flat-square
[b-gitter]: https://badges.gitter.im/Join%20Chat.svg
[b-version]: http://img.shields.io/npm/v/gulp-runtime.svg?style=flat-square
[b-license]: http://img.shields.io/npm/l/gulp-runtime.svg?style=flat-square
