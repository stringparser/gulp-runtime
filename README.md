## gulp-runtime[<img alt="progressed.io" src="http://progressed.io/bar/41" align="right"/>](https://github.com/fehmicansaglam/progressed.io)

[<img alt="build" src="http://img.shields.io/travis/stringparser/gulp-runtime/master.svg?style=flat-square" align="right"/>](https://travis-ci.org/stringparser/gulp-runtime/builds)
[<img alt="NPM version" src="http://img.shields.io/npm/v/gulp-runtime.svg?style=flat-square" align="left"/>](http://www.npmjs.org/package/gulp-runtime)

[<img alt="npm downloads" src="http://img.shields.io/npm/dm/gulp-runtime.svg?style=flat-square" align="left"/>](http://img.shields.io/npm/dm/gulp-runtime.svg)
[<img alt="LICENSE" src="http://img.shields.io/npm/l/gulp-runtime.svg?style=flat-square" align="right"/>](http://opensource.org/licenses/MIT)
<br>

Use gulp whilst is running

 ```
 npm install gulp-runtime --save-dev
 ```

[Go straight to usage](#usage) or see the [todo](#todo) for a list of features planned.

<hr>

<b>Implementation status: before testing</b>

I'll be adding the last features of the [todo](#todo) to start stabilizing the project and wait for more bugs to come.

Also, I want to add that I've decided to move the main functionality to another repo since the package can be used as a runtime interface not only [`gulp`](https://github.com/gulpjs/gulp), but for whatever package one would like to use or none (just to build a cli from scratch), thats your decision *:)*.

Check out the [runtime](http://github.com/stringparser/runtime) repo for that.

I've started with the tests there and will be back and forth between here and there.

What is left? The features (not much at the moment) tests and better docs.

> Hey! No more wording: *go code already*.

... all right.

# Usage
> At the moment you can use `gulp` at runtime, command completion for your tasks and gulp flags is provided and nice task logging right there on your terminal (with and without color).

 - On progress [documentation](./docs)

Just require the module

```js
 // Your favourite gulpfile.js
 var runtime = require('gulp-runtime');
```

At runtime, after the running tasks have finished a prompt will appear (alternatively press <kbd>enter</kbd>).

```bash
[13:07:50] Starting 'default'...
[13:07:50]  > default
[13:07:50] Finished 'default' after 800 μs
 > gulp
```

Use the `gulp` cli without exiting the process. For example, the task tree (or other [`gulp` cli commands](https://github.com/gulpjs/gulp/blob/master/docs/CLI.md))

```bash
 > gulp -T
[13:07:51] Tasks for ~/code/gulp/runtime/gulpfile.js
[13:07:51] ├── default
[13:07:51] ├── css
[13:07:51] ├── js
[13:07:51] └─┬ process
[13:07:51]   ├── css
[13:07:51]   └── js
```

Tasks are there for command completion

![greypants/gulp-starter repo](https://raw.githubusercontent.com/stringparser/gulp-runtime/master/img/completion.png)

> Screenshot using the [greypant's gulp-starter](https://github.com/greypants/gulp-starter) repo

Do other gulp things such as, start a given task (or many)

```bash
 > gulp process
[13:50:56] Starting 'css'...
[13:50:56] Finished 'css' after 14 μs
[13:50:56] Starting 'js'...
[13:50:56] Finished 'js' after 11 μs
[13:50:56] Starting 'process'...
[13:50:56] Finished 'process' after 11 μs
 > gulp
```

Last but not least! You can define custom commands before hand

```js
var runtime = require('gulp-runtime');

runtime.set('yeeeha', function(){
  console.log('Start dancing!')
})
```

and use them afterwards while you are shooting gulp tasks.

```shell
> gulp yeeeha
Start dancing!
> gulp
```

## TODO

 - [X] `gulp` cli at runtime.
 - [X] Command completion.
 - [X] Register custom runtime commands.
 - [X] Support standard shell behavior (Ctrl+L, Ctrl+C, history, etc.).
    * [`readline`](http://nodejs.org/api/readline.html) to the rescue. It even provides completion options!
 - [ ] API documentation.
 - [ ] Follow `gulp` plugin integration (log, errors, etc.)
 - [X] Include all taks inside a folder.
 - [X] Log task code directly on the terminal.
 - [X] Highlight the code accordingly.
    * Thanks to the awesome [dominic tarr's `ansi-higlight`](https://github.com/dominictarr/ansi-highlight).
 - [ ] Write tests.
 - [ ] Provide `real life` examples.

<hr>

[![NPM](https://nodei.co/npm/gulp-runtime.png?downloads=true)](https://nodei.co/npm/gulp-runtime/)

## License

MIT
