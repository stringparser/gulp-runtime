## document the CLI


### flags

gulp flags (see the [gulp CLI documentation][x-gulp-cli])

- `-v` or `--version` will display the global and local gulp versions
- `--require <module path>` will require a module before running the gulpfile. This is useful for transpilers but also has other applications. You can use multiple `--require` flags
- `--gulpfile <gulpfile path>` will manually set path of gulpfile. Useful if you have multiple gulpfiles. This will set the CWD to the gulpfile directory as well
- `--cwd <dir path>` will manually set the CWD. The search for the gulpfile, as well as the relativity of all requires will be from here
- `-T` or `--tasks` will display the task dependency tree for the loaded gulpfile
- `--tasks-simple` will display a plaintext list of tasks for the loaded gulpfile
- `--color` will force gulp and gulp plugins to display colors even when no color support is detected
- `--no-color` will force gulp and gulp plugins to not display colors even when color support is detected
- `--silent` will disable all gulp logging

and a lazy addition that is not in the gulp CLI

- `--log <task1> <task2> ...` log tasks code directly on the terminal. Useful for lazyness and other things. Code highlighted with [docminic tar's ansi-highlight](x-ansi-highlight) by default. If `--no-color` flag is set the will be no highlight at all just logging of that task.

### commands

```js
var runtime = require('gulp-runtime');
```

Commands are **tasks**, **flags** or **custom commands** defined with `runtime.set` (more information at the [api doc](api.md)).

`commands` can be executed as they are with gulp with either:
  - Running `gulp <command1> <command2>` from command line
  - Using a gulpfile `node project/gulpfile.js <command1> <command2>`.

and at runtime in the REPL, of course. Thats the whole idea.

Just running `gulp` or `node project/gulpfile.js` will execute the task you registered called `default`. If there is no `default` task gulp will error when you run `gulp` and gulp-runtime will error when you run `node project/gulpfile.js`.

[x-gulp-cli]: https://github.com/gulpjs/gulp/blob/master/docs/CLI.md
[x-ansi-highlight]: https://github.com/dominictarr/ansi-highlight
