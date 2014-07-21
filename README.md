## gulp-runtime

 Lazy to open a new tab terminal to use the cli?

```js
npm install gulp-runtime --save-dev
```

 Warning!: Work in progress :)

## How

Include the package in your `gulpfile`

```js
 // Your favourite gulpfile.js
 var gulp = require('gulp');
 var runtime = require('gulp-runtime');
```

## onUse

After you run the `gulpfile` a prompt ` > gulp ` attached to the current gulp instance is displayed like so

```bash
[13:07:50] Using gulpfile /home/javier/code/gulp/runtime/gulpfile.js
[13:07:50] Starting 'default'...
[13:07:50]  > default
[13:07:50] Finished 'default' after 800 μs
 > gulp
```


See the current task tree (or other [`gulp` cli commands](https://github.com/gulpjs/gulp/blob/master/docs/CLI.md))
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
 - [X] See task functions just with a 'show' command.
 - [ ] Include all taks inside a folder.
 - [ ] API documentation.
 - [ ] Provide `real life` examples.
 - [ ] Write tests.

## License

MIT
