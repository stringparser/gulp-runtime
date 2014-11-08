## CLI/REPL documentation

What commands are implemented by default and how to run them.
All commands below serve to the CLI and REPL at the same time. If you are interested in how to implement commands go to the [API documentation](api.md).

### Commands

```js
var runtime = require('gulp-runtime');
```

Commands are either:
  **tasks**,
  **flags**,
  **those** created with `runtime.set` (read the [api docs](api.md)).

To execute a command you either can:
  - Running `gulp <cmd1> <cmd2>` from command line
  - With a gulpfile `node project/gulpfile <cmd1> <cmd2>` from command line.

Provided the `gulpfile` required the module.

Just running `gulp` or `node project/gulpfile` will execute the task you registered called `default`. If there is no `default` task:
  - gulp will error when you run `gulp`
  - gulp-runtime will error when you run `node project/gulpfile`.

### Flags

> From [gulp CLI documentation][x-gulp-cli]
<ul>
  <li>`-v` or `--version` will display the global and local gulp versions
  <li> `--require <module path>` will require a module before running the gulpfile. This is useful for transpilers but also has other applications. You can use multiple `--require` flags
  <li> `--gulpfile <gulpfile path>` will manually set path of gulpfile. Useful if you have multiple gulpfiles. This will set the CWD to the gulpfile directory as well
  <li> `--cwd <dir path>` will manually set the CWD. The search for the gulpfile, as well as the relativity of all requires will be from here
  <li> `-T` or `--tasks` will display the task dependency tree for the loaded gulpfile
  <li> `--tasks-simple` will display a plaintext list of tasks for the loaded gulpfile
  <li> `--color` will force gulp and gulp plugins to display colors even when no color support is detected
  <li> `--no-color` will force gulp and gulp plugins to not display colors even when color support is detected
  <li> `--silent` will disable all gulp logging
</ul>

and a lazy addition that is not in the gulp CLI

- `--log-task <task1> <task2> ...` log tasks code directly on the terminal. Useful for lazyness and other things. Code highlighted with [docminic tar's ansi-highlight](x-ansi-highlight) by default. If `--no-color` flag is set the will be no highlight at all just logging of that task.


[x-gulp-cli]: https://github.com/gulpjs/gulp/blob/master/docs/CLI.md
[x-ansi-highlight]: https://github.com/dominictarr/ansi-highlight
