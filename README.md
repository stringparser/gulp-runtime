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
 - [Tasks :names with :parameters](docs/README.md#tasks-with-parameters)

### samples

task names can have parameters (like express routes)

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
    // some build step
    .pipe(gulp.dest(dest));
});

gulp.task('minify', function (done, sources, dest) {
  return gulp.src(sources)
    // minify
    .pipe(gulp.dest(dest));
});

gulp.task('build min', function (done) {
  gulp.series('build', 'minify')('src/**/*.js', 'dest/source.min.js', done);
});
```

---

functions can be used directly as gulp#4.0 will do

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

gulp.task('build min', function (done) {
  gulp.series(build, minify)('src/**/*.js', 'dest/source.min.js', done);
});

```
---

split builds using instances

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

module.exports = styles;
```

---

create a REPL and continue running tasks after `default` has ended (this will also improve the performance of next tasks since all modules are loaded already)

```js
var gulp = require('gulp-runtime').create({ repl: true });

gulp.task(':number', function (done) {
  setTimeout(done, 100);
});

gulp.task('default', ['one', 'two']);
```

now go to the terminal and do

```sh
node gulpfile.js
```

which will run a REPL with the tasks defined.

> [See more](./docs/README.md#REPL)

### install

With [npm][npm]

```sh
npm install --save-dev gulp-runtime
```

### why

I wanted to do a REPL for gulp because it was missing for me and on its own way, is the ultimate `define and use as use as you like` kind of thing. Of course, then, more and more stuff had to go in and, more importantly, the REPL had to behave in such a way that it could be used mostly like the terminal does (autocompletion, etc.).

So it got out of hand :D.

But well oh well, here we are.

### license

[![License][badge-license]][license]

<!-- links -->

[npm]: npmjs.com/gulp-runtime
[license]: opensource.org/licenses/MIT
[vinylFs]: npmjs.com/package/vinyl-fs
[travis-build]: travis-ci.org/stringparser/gulp-runtime/builds

[badge-build]: http://img.shields.io/travis/stringparser/gulp-runtime/master.svg?style=flat-square
[badge-version]: http://img.shields.io/npm/v/gulp-runtime.svg?style=flat-square
[badge-license]: http://img.shields.io/npm/l/gulp-runtime.svg?style=flat-square
[badge-downloads]: http://img.shields.io/npm/dm/gulp-runtime.svg?style=flat-square
