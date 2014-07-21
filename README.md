## gulp-runtime

gulp runtime manager.

`npm install gulp-runtime --save-dev`

Warning!: Work in progress :)

## Why?

 Lazy to open a new terminal tab? I'm here to help.

## How

  Include the package in your `gulpfile` and when you run `gulp`
  you'll get a gulp cli prompt like ` > gulp ` attached to the current gulp instance like so.

```js
 // Your favourite gulpfile.js
 var gulp = require('gulp');
 var runtime = require('gulp-runtime')(gulp);
```

  After running the gulpfile you'll get

```bash
[13:07:50] Using gulpfile /home/javier/code/gulp/runtime/gulpfile.js
[13:07:50] Starting 'default'...
[13:07:50]  > default
[13:07:50] Finished 'default' after 800 μs
 > gulp
```

So to see the current task tree
```bash
 > gulp -T
[13:07:51] Using gulpfile /home/javier/code/gulp/runtime/gulpfile.js
[13:07:51] Tasks for /home/javier/code/gulp/runtime/gulpfile.js
[13:07:51] ├── default
[13:07:51] ├── css
[13:07:51] ├── js
[13:07:51] └─┬ process
[13:07:51]   ├── css
[13:07:51]   └── js
```
To start a task
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

Show a task function
To start a task
``` bash
 > gulp show process
gulp.task('process',["css","js"],function () {});
 > gulp
```

## TODO

 - [*] Use gulp cli at runtime.
 - [*] See task functions using `show` command.
 - [ ] Provide a way to include taks as separate files on a folder.
 - [ ] Write tests.

## License

MIT
