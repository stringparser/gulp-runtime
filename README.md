## gulp-runtime [![build][b-build]][x-travis][![NPM version][b-version]][p-gulp-runtime] [![Gitter][b-gitter]][x-gitter]

> an alternate interface to [vinyl-fs][p-vinylFs]

[install](#install) -
[documentation](#documentation) -
[examples](#examples) -
[why](#why) -
[license](#license)

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


## documentation

The `module.exports` a function

```js
var create = require('gulp-runtime');
```

### create
```js
function create([string name|object options, object options])
```
Key-value store for instances.
 - Sets a new instance `name` if there wasn't one.
 - Gets an instance `name` previously instantiated.

Any instance can be tranformed into a repl passing `{repl: true}` as options.

_arguments_
 - `name` type string, the name given for the instance
 - `options` type object, options passed down to the instance
  - `options.log` type boolean, whether to log or not
  - `options.repl` type boolean, whether to make a repl with the instance
  - `options.input` type stream, input stream for the repl
  - `options.output` type stream, output stream for the repl

_defaults_
 - `name` defaults to `#root`
 - if `options.repl` or `options.input` is truthy a repl is created
  at `instance.repl` using the [readline][m-readline] module
  - if `options.input` is not a stream, to `process.stdin`
  - if `options.output` is not a stream, to `process.stdout`

_returns_
 - an existing instance `name` if `name` is given
 - a new instance if there wasn't `name` wasn't created before

#### runtime.task
```js
function task(string name[, string|array deps, function handle])
```

_arguments_
- `name` type string, parsed and stored with [parth][p-parth] for later lookup
- `deps` type array or string, tasks to run before this one in series. If tasks are given as a string they must be space separated.
- `handle` type function to call when `runtime.stack` is used.

_throws_
 - if types doesn't match
 - if there is a circular dependency for the task given

_returns_ `this`

### runtime.src
```js
function src(string|array glob[, object opt])
```
Same as [vinylFs.src][p-vinylFs.src]

### runtime.dest
```js
function dest(string|function folder[, object opt])
```
Same as [vinylFs.dest][p-vinylFs.dest]

### runtime.watch
```js
function watch(string|array glob[, string|array|object opt, function cb])
```

Similar to [vinylFs.watch][p-vinylFs.watch] (run tasks when files change).
Additional features:
  - Files can be reloaded on the `require.cache`
  - Tasks can be run in series directly if so specified

_arguments_ differences with [gulp.watch][m-gulp-watch]
 - `tasks` can be a string, space separated tasks will be dispatched as written
 - when `opt` is an object, it can have non mandatory properties below
  - `opt.wait` type boolean, if `opt.tasks` should run in series or not
  - `opt.tasks` type array|string, tasks to run after change and before reload
  - `opt.reload` type boolean, wether or not to reload a file

_defaults_
 - `opt.wait` to `false`
 - `opt.reload` to `undefined`

_returns_
 - a watcher, same as [gulp.watch][p-gulp-watch]

> Notes:
- callback arguments are (a gaze event, the `opt`s given)
- Only files one of the `require.extensions` will be reloaded
- When a file is deleted on disk, the reload will be skipped but the
callback is still invoked

```js
var gulp = require('gulp-runtime').create();

gulp.watch('app/*.*', {
  wait: true,  // run tasks after change in series
  tasks: 'sass css jsx browserSync',
  reload: true // reload app/*.js files as they change
}, function(ev, opt){
  var reloaded = opt.reload && ev.type !== 'delete';
  console.log('%s was %s', ev.path, ev.type, reloaded ? 'and reloaded' : '');
});
```

### runtime.stack
```js
function stack(...arguments[, object props])
```

Returns a function which after call will invoke and give context to its `...arguments`.

_arguments_
- `...arguments`, type string or function
- `props`, type object, properties of stack of the [stack API][t-stack]. Look at its documentation for more details

**_throws_**
 - when no arguments are given

_returns_
- a `tick` callback, which, upon call will execute the stack arguments

## examples

For now you can look at the code at the [app-template][x-app-template] repo. Do not hesitate to [create a new issue][x-new-issue] with any comments or directly go to [gitter][x-gitter] and ask there directly. I'll be giving more code examples on the comming weeks.

## why

This started as repl for gulp with a simple interface (completion and cli commands). But it was somewhat limited by how functions were composed at runtime and how you could run a functions previously set. As the project grew I wanted to be able to have more control over task definition and execution. To make this happen:

 - [parth][p-parth] path-to-regex madness
 - [tornado][p-tornado] composing asynchronous functions
 - [tornado-repl][p-tornado-repl] a repl for tornado

So now the project puts together this things learnt for [vinyl-fs][p-vinylFs] giving an alternate interface for it.

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

[x-gulp-cli]: https://github.com/gulpjs/gulp/blob/master/docs/CLI.md

[x-gitter]: https://gitter.im/stringparser/gulp-runtime
[x-travis]: https://travis-ci.org/stringparser/gulp-runtime/builds
[x-license]: http://opensource.org/licenses/MIT
[x-new-issue]: https://github.com/stringparser/gulp-runtime/issues/new

[x-app-template]: https://github.com/stringparser/app-template/master/tree/gulpfile.js

[b-build]: http://img.shields.io/travis/stringparser/gulp-runtime/master.svg?style=flat-square
[b-gitter]: https://badges.gitter.im/Join%20Chat.svg
[b-version]: http://img.shields.io/npm/v/gulp-runtime.svg?style=flat-square
[b-license]: http://img.shields.io/npm/l/gulp-runtime.svg?style=flat-square
