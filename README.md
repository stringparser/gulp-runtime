## gulp-runtime
[![Travis status](https://travis-ci.org/stringparser/gulp-runtime.svg?branch=master)](https://travis-ci.org/stringparser/gulp-runtime/builds)
[![Code Climate](https://codeclimate.com/github/stringparser/gulp-runtime.png)](https://codeclimate.com/github/stringparser/gulp-runtime)
[![NPM version](https://badge.fury.io/js/gulp-runtime.svg)](http://badge.fury.io/js/gulp-runtime)
[![LICENSE](http://img.shields.io/packagist/l/doctrine/orm.svg)](http://opensource.org/licenses/MIT)

 Want to use gulp whilst is running?
 ```js
 npm install gulp-runtime --save-dev
 ```

<hr>
<b>Implementation status: chubby</b>

See the [todo](#todo) for a list of features planned.

At this point the main area for this to work properly is done. What is left is debugging and fitting so I'll be doing the docs now in order to get going.

## onUse

Just require the module

```js
 // Your favourite gulpfile.js
 var runtime = require('gulp-runtime');
```

At runtime, when you want to see the prompt, press `enter`.

```bash
[13:07:50] Starting 'default'...
[13:07:50]  > default
[13:07:50] Finished 'default' after 800 μs
 > gulp
```
At the moment you can use the `gulp` cli without exiting the process.

For example, the task tree (or other [`gulp` cli commands](https://github.com/gulpjs/gulp/blob/master/docs/CLI.md))

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
Start a given task

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

Define a custom command before hand:

```
var runtime = require('gulp-runtime');

runtime.set('yeeeha', function(){
  console.log('Start dancing!')
})
```

And use it afterwards while you are shooting gulp tasks.

```
> gulp yeeeha
Start dancing!

```

## TODO

 - [X] Use gulp cli at runtime.
 - [ ] Display task code directly on the terminal.
 - [ ] Highlight task code accordingly.
    * Thanks to the awesome [dominic tarr's `ansi-higlight`](https://github.com/dominictarr/ansi-highlight).
 - [X] Support standard shell behavior (Ctrl+L, Ctrl+C, history, etc.).
    * [`readline`](http://nodejs.org/api/readline.html) to the rescue. It even provides completion options!
 - [ ] Include all taks inside a folder.
 - [X] Register custom runtime commands.
 - [ ] Command completion.
 - [ ] API documentation.
 - [ ] Write tests.
 - [ ] Provide `real life` examples.

<hr>
[![NPM](https://nodei.co/npm/gulp-runtime.png?downloads=true)](https://nodei.co/npm/gulp-runtime/)

## License

MIT
