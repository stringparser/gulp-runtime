## gulp-runtime [![NPM version][badge-version]][x-npm] [![downloads][badge-downloads]][x-npm]

[![build][badge-build]][x-travis]

> an alternate interface to [vinyl-fs][x-vinylFs]

[install](#install) -
[examples](#examples) -
[why](#why) -
[license](#license)


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
[x-travis]: https://travis-ci.org/stringparser/gulp-runtime/builds
[x-license]: http://opensource.org/licenses/MIT
[x-vinylFs]: https://www.npmjs.com/package/vinyl-fs
[x-new-issue]: https://github.com/stringparser/gulp-runtime/issues/new

[badge-build]: http://img.shields.io/travis/stringparser/gulp-runtime/master.svg?style=flat-square
[badge-version]: http://img.shields.io/npm/v/gulp-runtime.svg?style=flat-square
[badge-license]: http://img.shields.io/npm/l/gulp-runtime.svg?style=flat-square
[badge-downloads]: http://img.shields.io/npm/dm/gulp-runtime.svg?style=flat-square
