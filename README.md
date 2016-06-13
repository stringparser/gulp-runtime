## gulp-runtime [![NPM version][badge-version]][npm] [![downloads][badge-downloads]][npm]

[![build][badge-build]][travis-build]

> an alternate interface to [`vinyl-fs`][vinylFs]

[install](#install) -
[docs](#docs) -
[why](#why) -
[license](#license)

### features

 - [Instances](docs/README.md#multiple-instances)
 - [gulp API and more](docs/README.md#gulp-api-and-more)
 - [REPL with autocomplete](docs/README.md#repl-with-autocomplete)
 - [Tasks names :can have :parameters](docs/README.md#tasks-with-parameters)

### install

With [npm][npm]

```sh
npm install --save-dev gulp-runtime
```

### why

I wanted to do a REPL for gulp.

Why? Because I really love how gulp lets you package asynchronous functions and reuse them while letting you use the tool you prefer (callbacks, promises, streams and later even RxJS observables). So the REPL was the ultimate `define and use as use as you like` paradigm.

Of course, then, more and more stuff had to go in and, more importantly, the REPL had to behave in such a way that it could be used mostly like the terminal does (autocompletion, etc.).

So it got out of hand. Very much so. But well oh well, here we are.

### license

[![License][badge-license]][license]

<!-- links -->

[npm]: https://npmjs.com/gulp-runtime
[license]: http://opensource.org/licenses/MIT
[vinylFs]: https://www.npmjs.com/package/vinyl-fs
[travis-build]: https://travis-ci.org/stringparser/gulp-runtime/builds

[badge-build]: http://img.shields.io/travis/stringparser/gulp-runtime/master.svg?style=flat-square
[badge-version]: http://img.shields.io/npm/v/gulp-runtime.svg?style=flat-square
[badge-license]: http://img.shields.io/npm/l/gulp-runtime.svg?style=flat-square
[badge-downloads]: http://img.shields.io/npm/dm/gulp-runtime.svg?style=flat-square
