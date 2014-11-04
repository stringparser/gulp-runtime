

## [gulp](https://github.com/gulpjs/gulp)-runtime [<img alt="progressed.io" src="http://progressed.io/bar/50" align="right"/>](https://github.com/fehmicansaglam/progressed.io)

[<img alt="build" src="http://img.shields.io/travis/stringparser/gulp-runtime/master.svg?style=flat-square" align="left"/>](https://travis-ci.org/stringparser/gulp-runtime/builds)
[<img alt="NPM version" src="http://img.shields.io/npm/v/gulp-runtime.svg?style=flat-square" align="right"/>](http://www.npmjs.org/package/gulp-runtime)

<br>
> Child project of [runtime](https://github.com/stringparser/runtime)

A runtime interface for gulp

## install

    mpm install --save-dev gulp-runtime

## usage

For a REPL, just require the module

```js
 var runtime = require('gulp-runtime');
```

and when you want to see the prompt, press enter

```bash
[13:07:50] Starting 'default'...
[13:07:50] Finished 'default' after 800 μs
 >
```

Out of the box you can use `gulp` cli without exiting the process, for example, the task tree (or other [`gulp` cli commands](https://github.com/gulpjs/gulp/blob/master/docs/CLI.md))

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

or run your tasks

```bash
 > (press tab)
--silent        --tasks         -T              --tasks-simple  -v              --version       --require
--gulpfile      -l              --log           lint            jade            stylus          js
jsx             browserify      default


 > browserify
[14:28:53] Starting 'js', 'jsx', 'browserify' ...
[14:28:53] Finished 'js' after 17 μs, 'jsx' after 21 μs, 'browserify' after 27 μs
```

Likewise you can define your own commands

```js
var runtime = require('gulp-runtime');

runtime.set('yeeeha', function(argv, args, next){
  next('wohoo dance --lol');
});

runtime.set('wohoo', function(argv, args, next){
  var consumeThem = argv.splice(0, 2).join(' ').toUpperCase();
  console.log('wohoo %s, %s', consumeThem, args.lol+'!');
});
```

and use them while you are shooting tasks

```bash
 > jsx
[14:56:08] Starting 'jsx' ...
[14:56:08] Finished 'jsx' after 7.31 μs
 > yeeeha
Start dancing!
wohoo DANCE --LOL, true!
```

Use `--silent` to get access to `through2` streams for the `runtime.input` and `runtime.output` making possible to do the same you could typing it by hand (in this mode, the process will not wait for input, i.e. the process will exit it normally does on node)

```js
// 'someGulpfile.js' at 'someDir/'
process.argv.push('--silent');

var gulp = require('gulp');
var runtime = require('gulp-runtime');

gulp.task('aTask', function(){
  return runtime.output;
})
runtime.output.pipe(process.stdout);
runtime.input.write('aTask\n'); // \n is needed
```

and to wrap up, a gulpfile can be runned directly 

```bash
 $ node someDir/someGulpfile.js
[13:07:50] Starting 'aTask'...
[13:07:50] Finished 'aTask' after 700 μs
```

### api documentation

If you just want the repl requiring the package will be enough for you.

If you want to see what's beneath this madness and/or are interested in using input and output streams to the runtime interface [look at the documentation](https://github.com/stringparser/gulp-runtime/blob/master/README.md) is not that long.

### features
- `gulp` cli at runtime.
- Run gulp directly from a `gulpfile`.
- Custom commands and flow control for them.
- CLI completion at runtime out of the box.
- Standard shell behavior (Ctrl+L, Ctrl+C, history, etc.).
   * Using [`readline`](http://nodejs.org/api/readline.html).
- Log task code directly on the terminal (yep, I'm  that lazy).
   * Using [dominic tarr's `ansi-higlight`]
    (https://github.com/dominictarr/ansi-highlight).

### pending

 - [ ] Unicorn approval.

### stats

[<img src="https://nodei.co/npm/gulp-runtime.png?downloads=true&downloadRank=true&stars=true" alt="NPM" align="center"/>](https://nodei.co/npm/gulp-runtime)

[<img src="https://nodei.co/npm-dl/gulp-runtime.png" alt="NPM" align="center"/>](https://nodei.co/npm/gulp-runtime/)

## license

[<img alt="LICENSE" src="http://img.shields.io/npm/l/gulp-runtime.svg?style=flat-square"/>](http://opensource.org/licenses/MIT)
