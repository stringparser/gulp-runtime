

## [gulp](https://github.com/gulpjs/gulp)-runtime [<img alt="progressed.io" src="http://progressed.io/bar/50" align="right"/>](https://github.com/fehmicansaglam/progressed.io)

[<img alt="build" src="http://img.shields.io/travis/stringparser/gulp-runtime/master.svg?style=flat-square" align="left"/>](https://travis-ci.org/stringparser/gulp-runtime/builds)
[<img alt="NPM version" src="http://img.shields.io/npm/v/gulp-runtime.svg?style=flat-square" align="right"/>](http://www.npmjs.org/package/gulp-runtime)

<p align="center">Child project of <a href="https://github.com/stringparser/runtime">runtime</a></p>


A runtime interface for gulp

## install

    mpm install --save-dev gulp-runtime

### whats in
- REPL standard shell behavior (Ctrl+L, Ctrl+C, history, command and path completion).
- Custom commands definition and flow control.
- Run gulp locally and/or directly from a `gulpfile`.
- Log task code directly on the terminal (yep, I'm  that lazy).

## usage

For a REPL, just require the module

```js
 var runtime = require('gulp-runtime');
```
when you want to see the prompt, press enter

```bash
[13:07:50] Starting 'default'...
[13:07:50] Finished 'default' after 800 μs
 >
```
run tasks

```
> (press tab)
--silent        --tasks         -T              --tasks-simple  -v              --version       --require
--gulpfile      lint            jade            stylus          js
jsx             browserify      default
 > browserify
[14:28:53] Starting 'js', 'jsx', 'browserify' ...
[14:28:53] Finished 'js' after 17 μs, 'jsx' after 21 μs, 'browserify' after 27 μs
```

use [`gulp` cli](https://github.com/gulpjs/gulp/blob/master/docs/CLI.md) without exiting the process

```
 > --tasks
[14:25:14] Tasks for ~/code/gulp-runtime/gulpfile.js
[14:25:14] ├── lint
[14:25:14] ├── jade
[14:25:14] ├── stylus
[14:25:14] ├── js
[14:25:14] ├── jsx
[14:25:14] ├─┬ browserify
[14:25:14] │ ├── js
[14:25:14] │ └── jsx
[14:25:14] └─┬ default
[14:25:14]   ├── lint
[14:25:14]   ├── jade
[14:25:14]   ├── stylus
[14:25:14]   └── browserify
```

## api documentation

If you just want the REPL requiring the package will be enough for you.

If you want learn more about this thing, i.e. want to change the prompt text, see want can be done with commands or you are interested in using input and output streams to the runtime interface [look at the documentation](docs/readme.md).

### pending

 - [ ] Unicorn approval.

### stats

[<img src="https://nodei.co/npm/gulp-runtime.png?downloads=true&downloadRank=true&stars=true" alt="NPM" align="center"/>](https://nodei.co/npm/gulp-runtime)

[<img src="https://nodei.co/npm-dl/gulp-runtime.png" alt="NPM" align="center"/>](https://nodei.co/npm/gulp-runtime/)

## license

[<img alt="LICENSE" src="http://img.shields.io/npm/l/gulp-runtime.svg?style=flat-square"/>](http://opensource.org/licenses/MIT)
