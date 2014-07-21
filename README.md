## gulp-runtime

gulp runtime manager.

`npm install gulp-runtime --save-dev`

Warning!: Work in progress :)

## Why?

 Lazy to open a new terminal tab? I'm here to help.

## How

  Include the package in your `gulpfile` and when you run `gulp`
  you'll get a cli interface for the current gulp instance like so.

```js
 \* Your favourite gulpfile.js *\
 var gulp = require('gulp');
 var runtime = require('gulp-runtime')(gulp);
```

  After running the gulpfile you'll get

```bash
[13:07:50] Using gulpfile /home/javier/code/gulp/runtime/gulpfile.js
[13:07:50] Starting 'default'...
[13:07:50]  > default
[13:07:50] Finished 'default' after 800 μs
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


## TODO

 - <s>Use gulp cli at runtime</s>.
 - <s>See task functions</s>.
 - Add/remove tasks at runtime.
 - Write tests.

## License

MIT
