## gulp-runtime[<img alt="progressed.io" src="http://progressed.io/bar/41" align="right"/>](https://github.com/fehmicansaglam/progressed.io)
[![Travis status](https://travis-ci.org/stringparser/gulp-runtime.svg?branch=master)](https://travis-ci.org/stringparser/gulp-runtime/builds)
[![Code Climate](https://codeclimate.com/github/stringparser/gulp-runtime.png)](https://codeclimate.com/github/stringparser/gulp-runtime)
[![NPM version](https://badge.fury.io/js/gulp-runtime.svg)](http://badge.fury.io/js/gulp-runtime)
[<img alt="LICENSE" src="http://img.shields.io/packagist/l/doctrine/orm.svg" align="right"/>](http://opensource.org/licenses/MIT)

Use gulp whilst is running

 ```
 npm install gulp-runtime --save-dev
 ```

[Go straight to usage](#usage) or see the [todo](#todo) for a list of features planned.

<b>Implementation status: before testing</b>

I'll be adding the last features of the [todo](#todo) to start stabilizing the project and wait for more bugs to come.

Also, I want to add that I've decided to move the main functionality to another repo since the package can be used as a runtime interface not only [`gulp`](https://github.com/gulpjs/gulp), but for whatever package one would like to use or none (just to build a cli from scratch), thats your decision *:)*.

Check out the [runtime](http://github.com/stringparser/runtime) repo for that.

I've started with the tests there and will be back and forth between here and there.

What is left? The features (not much at the moment) tests and better docs.

> No more wording: *go code already :D*.

# Features at the moment

>  - runtime `gulp` cli/repl.
>  - command completion
>  - nice task logging right there on your terminal (with and without color).

# Usage
 - On progress [documentation](./docs)

Just require the module

```js
 // Your favourite gulpfile.js
 var runtime = require('gulp-runtime');
```

At runtime, after the `default` tasks has finished a prompt will appear.

```bash
[13:07:50] Starting 'default'...
[13:07:50]  > default
[13:07:50] Finished 'default' after 800 μs
 > gulp
```
Or also, when you want to see the prompt, press `enter`.

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

And last but not least! You can define custom commands before hand:

```js
var runtime = require('gulp-runtime');

runtime.set('yeeeha', function(){
  console.log('Start dancing!')
})
```

And use them afterwards while you are shooting gulp tasks.

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
 - [X] Display task code directly on the terminal.
 - [X] Highlight task code accordingly.
    * Thanks to the awesome [dominic tarr's `ansi-higlight`](https://github.com/dominictarr/ansi-highlight).
 - [ ] Write tests.
 - [ ] Provide `real life` examples.

<hr>

[![NPM](https://nodei.co/npm/gulp-runtime.png?downloads=true)](https://nodei.co/npm/gulp-runtime/)

## License

MIT
