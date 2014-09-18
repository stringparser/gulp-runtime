[<img alt="build" src="http://img.shields.io/travis/stringparser/gulp-runtime/master.svg?style=flat-square" align="left"/>](https://travis-ci.org/stringparser/gulp-runtime/builds)
[<img alt="NPM version" src="http://img.shields.io/npm/v/gulp-runtime.svg?style=flat-square" align="right"/>](http://www.npmjs.org/package/gulp-runtime)
[<img alt="npm downloads" src="http://img.shields.io/npm/dm/gulp-runtime.svg?style=flat-square" align="right"/>](http://img.shields.io/npm/dm/gulp-runtime.svg)

## [gulp](https://github.com/gulpjs/gulp)-runtime[<img alt="progressed.io" src="http://progressed.io/bar/50" align="right"/>](https://github.com/fehmicansaglam/progressed.io)

Use gulp whilst is running

<br>

**Implementation status: testing**

I've started the tests and hopefully soon there will be a stable release.

## install

    mpm install gulp-runtime --save-dev

## usage

```js
 var runtime = require('gulp-runtime');
```

When all tasks are fished a prompt will appear (or press enter).

```bash
[13:07:50] Starting 'default'...
[13:07:50] Finished 'default' after 800 μs
 >
```

Use the `gulp` cli without exiting the process.

For example, the task tree (or other [`gulp` cli commands](https://github.com/gulpjs/gulp/blob/master/docs/CLI.md))

```bash
 > -T
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

Run a task

```bash
 > (press tab)
--silent        --tasks         -T              --tasks-simple  -v              --version       --require
--gulpfile      -l              --log           lint            jade            stylus          js
jsx             browserify      default


 > browserify
[14:28:53] Starting 'js', 'jsx', 'browserify' ...
[14:28:53] Finished 'js' after 17 μs, 'jsx' after 21 μs, 'browserify' after 27 μs
```

Define custom commands

```js
var runtime = require('gulp-runtime');

runtime.set('yeeeha', function(){
  console.log('Start dancing!')
})
```

Use them while you are shooting tasks.

```bash
 > jsx
[14:56:08] Starting 'jsx' ...
[14:56:08] Finished 'jsx' after 7.31 μs
 > yeeeha
Start dancing!
```

### api documentation

Soon.

### features
- [X] `gulp` cli at runtime.
- [X] Custom commands.
- [X] Completion for tasks and commands.
- [X] Standard shell behavior (Ctrl+L, Ctrl+C, history, etc.).
   * Using [`readline`](http://nodejs.org/api/readline.html).
- [X] Include all taks inside a folder.
- [X] Log task code directly on the terminal and highlight it (yep, I'm  that lazy).
   * Using [dominic tarr\'s `ansi-higlight`]
    (https://github.com/dominictarr/ansi-highlight).

### todo

 - [ ] API documentation.
 - [ ] Write tests.

### stats

[<img src="https://nodei.co/npm/gulp-runtime.png?downloads=true&downloadRank=true&stars=true" alt="NPM" align="center"/>](https://nodei.co/npm/gulp-runtime)

[<img src="https://nodei.co/npm-dl/gulp-runtime.png" alt="NPM" align="center"/>](https://nodei.co/npm/gulp-runtime/)

## license

[<img alt="LICENSE" src="http://img.shields.io/npm/l/gulp-runtime.svg?style=flat-square"/>](http://opensource.org/licenses/MIT)
