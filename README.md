## gulp-runtime
[![Travis status](https://travis-ci.org/stringparser/gulp-runtime.svg?branch=master)](https://travis-ci.org/stringparser/gulp-runtime/builds)
[![Code Climate](https://codeclimate.com/github/stringparser/gulp-runtime.png)](https://codeclimate.com/github/stringparser/gulp-runtime)
[![NPM version](https://badge.fury.io/js/gulp-runtime.svg)](http://badge.fury.io/js/gulp-runtime)
[![LICENSE](http://img.shields.io/packagist/l/doctrine/orm.svg)](http://opensource.org/licenses/MIT)

<b>Implementation status: young and crazy</b>

See the [todo](#todo) for the complete list of features planned.
I apologize beforehand for the missing documentation and bugs.

See [screenshot](#example) below for a 'live' example.
<hr>

 Want to use gulp whilst is running?
 ```js
 npm install gulp-runtime --save-dev
 ```

## onUse

Pass a `gulp` instance to the plugin.

```js
 // Your favourite gulpfile.js
 var gulp = require('gulp');
 var runtime = require('gulp-runtime')(gulp);
```

After all tasks are done, a prompt is displayed
```bash
[13:07:50] Starting 'default'...
[13:07:50]  > default
[13:07:50] Finished 'default' after 800 μs
 > gulp
```
See the current task tree (or other [`gulp` cli commands](https://github.com/gulpjs/gulp/blob/master/docs/CLI.md))
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

Show task function
``` bash
 > gulp show process
gulp.task('process',["css","js"],function () {});
 > gulp
```

[![NPM](https://nodei.co/npm/gulp-runtime.png?downloads=true)](https://nodei.co/npm/gulp-runtime/)

## TODO

 - [X] Use gulp cli at runtime.
 - [X] Display task code directly on the terminal.
 - [X] Highlight task code accordingly.
    * Thanks to the awesome [dominic tarr's `ansi-higlight`](https://github.com/dominictarr/ansi-highlight).
 - [X] Support standard shell behavior (Ctrl+L, Ctrl+C, history, etc.).
    * [`readline`](http://nodejs.org/api/readline.html) to the rescue. It even provides completion options!
 - [ ] Include all taks inside a folder.
 - [X] Register custom runtime commands.
 - [ ] Command completion.
 - [ ] API documentation.
 - [ ] Write tests.
 - [ ] Provide `real life` examples.

## Example

Screenshot using the [greypant's gulp-starter](https://github.com/greypants/gulp-starter) repo

![greypants/gulp-starter repo](https://raw.githubusercontent.com/stringparser/gulp-runtime/master/img/syntax-higlight.png)


## License

MIT
