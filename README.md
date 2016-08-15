## gulp-runtime [![NPM version][badge-version]][npm] [![downloads][badge-downloads]][npm]

[![build][badge-build]][travis-build]

![image](https://cloud.githubusercontent.com/assets/7457705/17462066/db4d59f2-5ca0-11e6-8ff1-a48005398cac.png)

[documentation](docs/README.md) -
[install](#install) -
[setup](docs/README.md#setup) -
[why](#why)

### features

 - [gulp API and more](docs/API.md)
 - [customizable logging](docs/logging.md)
 - [REPL with autocomplete](docs/REPL.md)
 - [Tasks :names with :parameters](docs/task-parameters.md)
 - [pass arguments from the task runner](docs/task-arguments.md)

### samples

#### CLI as tasks

```js
var gulp = require('gulp-runtime').create();

gulp.task('default', ['--tasks', '--version']);
```

#### task :parameters

```js
var gulp = require('gulp-runtime').create();

gulp.task('build :src :dest', function () {
  return gulp.src(this.params.src)
    // transform, compress, etc.
    .pipe(gulp.dest(this.params.dest));
});

gulp.task('default',
  gulp.parallel('build src/**/*.js build')
);
```

#### passing arguments

```js
var gulp = require('gulp-runtime').create();

gulp.task('read src', function (callback, src, dest) {
  dest = path.join(dest, new Date().toISOString());
  console.log('from', src, 'to', dest);

  var stream = gulp.src(src);

  callback(null, stream, dest);
});

gulp.task('write', function (done, stream, dest) {
  return stream.pipe(gulp.dest(dest));
});

// the default takes any arguments after '--' from the terminal
gulp.task('default',
  gulp.series('read src', 'write')
);
```

write

```js
node gulplfile.js -- src/**/*.js build
```

and arguments after `--` will be passed to the `default` task.

#### functions as tasks

Just as gulp#4.0

```js
var gulp = require('gulp-runtime').create();

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
```

#### split builds in instances

```js
var styles = require('gulp-runtime').create();

styles.task('less', function (done, sources, dest) {
  var less = require('gulp-less');
  var options = require('./build/options');

  return gulp.src(sources)
    .pipe(less(options.less))
    .pipe(gulp.dest(dest));
});

styles.task('default', ['less']);

exports = module.exports = styles;
```

#### a REPL after `default` has finished

```js
var gulp = require('gulp-runtime').create({ repl: true });

gulp.task(':number', function (done) {
  setTimeout(done, 100);
});

gulp.task('default', ['one', 'two']);
```

go to the terminal and do

```sh
node gulpfile.js
```

which will run a REPL with the tasks defined.

### install

With [npm][npm]

```sh
npm install --save-dev gulp-runtime
```

### why

Soon after I started to use `gulp` it came to mind

> I want a REPL for this

Mainly because a REPL is the closest to `define and use as you like`. If that was possible then writing task names in this REPL will run them just as doing the same from the command line.

Then I realized that what I really liked from `gulp` is the way you can bundle and compose async functions and how its this done under the hood. For that I had to try to do it by myself.

The above has lead to [gulp-repl][gulp-repl], [parth][parth], [runtime][runtime] and finally [gulp-runtime][npm].

So yeah, it got out of hand :D.

But well oh well, here we are.

### license

[![License][badge-license]][license]

<!-- links -->

[npm]: http://npmjs.com/gulp-runtime
[parth]: http://npmjs.com/parth
[license]: http://opensource.org/licenses/MIT
[vinylFs]: http://npmjs.com/vinyl-fs
[runtime]: http://github.com/stringparser/runtime
[gulp-repl]: http://github.com/stringparser/gulp-repl
[travis-build]: http://travis-ci.org/stringparser/gulp-runtime/builds

[badge-build]: http://img.shields.io/travis/stringparser/gulp-runtime/master.svg?style=flat-square
[badge-version]: http://img.shields.io/npm/v/gulp-runtime.svg?style=flat-square
[badge-license]: http://img.shields.io/npm/l/gulp-runtime.svg?style=flat-square
[badge-downloads]: http://img.shields.io/npm/dm/gulp-runtime.svg?style=flat-square
