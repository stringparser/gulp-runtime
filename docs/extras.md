## Extras

Stuff I found convenient to add.

### run [gulp][x-gulp] directly from a gulpfile

Instead of

```sh
gulp --gulpfile project/folder/gulpfile.js task
```

do

```sh
node project/folder/gulpfile.js task
```

### log highlighted task code directly on the terminal

It's something that lazy. But sometimes has proven to be useful.

Either on the REPL

```sh
 > --log-task aTask

gulp.task('aTask', ['deps'], function(){
 // the task code
});
```

or the CLI

```sh
 $ node project/gulpfile.js --log-task aTask > aTask.js

gulp.task('aTask', ['deps'], function(){
  // the task code
});
```

In this case is always without color.


More details on the [CLI/REPL documentation](cli-repl.md)

[x-gulp]: https://github.com/gulpjs/gulp
