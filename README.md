## gulp-runtime [![NPM version][badge-version]][npm] [![downloads][badge-downloads]][npm]

[![build][badge-build]][travis-build]

[install](#install) -
[docs](#docs) -
[why](#why) -
[license](#license)

### features

 - [Instances](docs/README.md#multiple-instances)
 - [REPL with autocomplete](docs/README.md#repl-with-autocomplete)
 - [gulp API and some extra methods](docs/README.md#gulp-api-and-more)
 - [Tasks names :can with :parameters](docs/README.md#tasks-with-parameters)

### samples

task names can have parameters (like in express routes)

```js
var gulp = require('gulp-runtime').create();

gulp.task('build :src :dest', function () {
  return gulp.src(this.params.src)
    // transform, compress, etc.
    .pipe(gulp.dest(this.params.dest));
});
```

or be passed as arguments to the task runner

```js
var gulp = require('gulp-runtime').create();

gulp.task('build', function (done, sources, dest) {
  return gulp.src(sources)
    // transform, compress, etc.
    .pipe(gulp.dest(dest));
});

gulp.task('build min', function (done) {
  gulp.start(['build'], 'src/**/*.js', 'dest/source.min.js', done);
});
```

___

split builds in instances

```js
var styles = require('gulp-runtime').create();

styles.task('less', function (done, sources, dest) {
  var less = require('gulp-less');
  var options = require('./build/options');

  return gulp.src(sources)
    .pipe(less(options.less))
    .pipe(gulp.dest(dest));
});
```

___

use a repl to continue running tasks after the default task has ended

```js
var gulp = require('gulp-runtime').create({ repl: true });

gulp.task('one', function (done) {
  setTimeout(done, 100);
});

gulp.task('two', function (done) {
  setTimeout(done, 100);
});

gulp.task('default', ['one', 'two']);
```

now go to the terminal and do

```sh
node gulpfile.js
```

which will run a repl with the tasks defined.

> NOTE: as long as the gulp instance specifies `repl: true`
> their tasks will be added to the repl. Which means that tasks defined this way live in the same object, the moduled used to make this happen is [gulp-repl][gulp-repl]

### install

With [npm][npm]

```sh
npm install --save-dev gulp-runtime
```

### why

I wanted to do a REPL for gulp because 1. was missing for me, 2. I really love how gulp lets you package asynchronous functions, reuse them but still let you use what you like (callbacks, promises, streams and even RxJS observables) and 3. the REPL, in its own way, is the ultimate `define and use as use as you like` kind of thing.

Of course, then, more and more stuff had to go in and, more importantly, the REPL had to behave in such a way that it could be used mostly like the terminal does (autocompletion, etc.).

So it got out of hand :D.

But well oh well, here we are :).

### license

[![License][badge-license]][license]

<!-- links -->

[npm]: npmjs.com/gulp-runtime
[license]: opensource.org/licenses/MIT
[vinylFs]: npmjs.com/package/vinyl-fs
[gulp-repl]: github.com/stringparser/gulp-repl
[travis-build]: travis-ci.org/stringparser/gulp-runtime/builds

[badge-build]: http://img.shields.io/travis/stringparser/gulp-runtime/master.svg?style=flat-square
[badge-version]: http://img.shields.io/npm/v/gulp-runtime.svg?style=flat-square
[badge-license]: http://img.shields.io/npm/l/gulp-runtime.svg?style=flat-square
[badge-downloads]: http://img.shields.io/npm/dm/gulp-runtime.svg?style=flat-square
