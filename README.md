## gulp-runtime [![GitHub version](https://badge.fury.io/gh/stringparser%2Fgulp-runtime.svg)](http://badge.fury.io/gh/stringparser%2Fgulp-runtime)

 Want to use gulp whilst is running?

[![NPM](https://nodei.co/npm/gulp-runtime.png?downloads=true)](https://nodei.co/npm/gulp-runtime/)

 At runtime you are able to:
  - Use `gulp cli` commandline.
  - Run `gulp tasks`.
  - Print a given `<task>`.
  - Use custom runtime commands.

See the [todo](#todo) list for the features planned.
I apologize beforehand for the missing documentation. Soon.

## How

Pass the `gulp` instance to the plugin.

```js
 // Your favourite gulpfile.js
 var gulp = require('gulp');
 var runtime = require('gulp-runtime')(gulp);
```

## onUse

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

## License

MIT
