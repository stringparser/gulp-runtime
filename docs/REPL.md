[docs](./README.md) |
[API](./API.md) |
[CLI](./CLI.md) |
[Logging](./logging.md) |
[REPL](./REPL.md) |
[task arguments](./task-arguments.md)


# REPL

```js
var gulp = require('gulp-runtime').create({ repl: true });
```

When an instance passes `repl: true` the process running does not exit when all tasks are done. For this case, REPL listening on `stdin`.

```sh
$ node gulpfile.js
```

press enter and you will see a prompt `>` that will run the tasks defined in the gulpfile

```sh
>
> build less compress png
```

For more information about how tasks are run see [gulp-repl][gulp-repl].

---
[Back to top ↑](#)

<!-- links -->

[gulp-repl]: https://github.com/stringparser/gulp-repl
