## gulp-runtime [![NPM version][badge-version]][npm] [![downloads][badge-downloads]][npm]

[![build][badge-build]][travis-build]

[docs](#docs) -
[install](#install) -
[setup](docs/#setup) -
[why](#why) -
[license](#license)

### features

 - [gulp API and more](docs/README.md#api)
 - [REPL with autocomplete](docs/README.md#repl)
 - [Tasks :names with :parameters](docs/README.md#tasks-with-parameters)
 - [pass arguments from the task runner](docs/README.md#task-arguments)

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

gulp.task('build:dev', function (done){
  gulp.start(["build src/**/*.js public"], done);
});
```

#### pass arguments from the task runner

```js
var gulp = require('gulp-runtime').create();

gulp.task('build', function (done, sources, dest) {
  var stream = gulp.src(sources)
    // some build steps here
    .pipe(function () {
      done(stream);
    });
});

gulp.task('minify', function (done, stream) {
  return stream
    // minify
    .pipe(gulp.dest(dest));
});

// pass arguments
gulp.task('build and min', function (done) {
  gulp.series('build', 'minify')('src/**/*.js', 'dest/source.min.js', done);
});
```

#### functions as tasks

Just as gulp#4.0

```js
var gulp = require('gulp-runtime').create();

function build (done, sources, dest) {
  return gulp.src(sources)
    // some build step
    .pipe(gulp.dest(dest));
}

function minify (done, sources, dest) {
  return gulp.src(sources)
    // minify
    .pipe(gulp.dest(dest));
}

// pass arguments
gulp.task('build min', function (done) {
  gulp.series(build, minify)('src/**/*.js', 'dest/source.min.js', done);
});

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

Mainly because a REPL is the closest to `define and use as you like`. If that was possible then writing task names in this REPL will run them just as doing the same from the command line but with the benefit of not having to end and start another process.

But wait, then I realized that what I really liked from `gulp` is the way you can bundle and compose async functions and, to understand how one could go about this, I had to do it for myself.

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
