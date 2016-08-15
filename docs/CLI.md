[docs](./README.md) -
[API](./API.md) -
[CLI](./CLI.md) -
[Logging](./logging.md) -
[REPL](./REPL.md) -
[task arguments](./task-arguments.md)

## CLI

The initial aim of this project was to be able to run gulp tasks directly from a  REPL. But when that was then possible, you would also assumme to be able to run the CLI from the REPL, right?

For this reason the [gulp cli](https://github.com/gulpjs/gulp/blob/master/docs/CLI.md) commands are set as tasks for each instance. This has turn to be useful to use them directly from other tasks.

Example:

```js
var gulp = require('gulp-runtime').create();

gulp.task('info', ['--tasks', '--version']);
// other tasks...
gulp.task('default', ['info']);
```

---
[Back to top ↑](#)
