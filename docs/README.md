> Found something wrong or missing? [Open an issue!](open-an-issue)

<h1>documentation</h1>

- [API](./API.md)
- [CLI](./CLI.md)
- [REPL](./REPL.md)
- [logging](./logging.md)
- [task arguments](./task-arguments.md)

## Setup

1. Install `npm install --save-dev gulp-runtime`

2. Open a `gulpfile`, or [create one][example-gulpfile], and

  change this line

  ```js
  var gulp = require('gulp');
  ```

  with

  ```js
  var gulp = require('gulp-runtime').create();
  ```

  After that run the `gulpfile` with `node` directly from the command line

  ```sh
  node gulpfile.js default watch serve
  ```

  Thats it! When no arguments are given the `default` task will run instead.

3. What about the CLI? Can I just run `gulp-runtime` from the terminal?

  Yes. For this add an alias to your `.bashrc`/`.zshrc`

  ```sh
  alias gulp-runtime='node $(find . -name "gulpfile.js" -not -path "./node_modules/*" | head -n1)'
  ```

  which will use the first `gulpfile.js` found in the current working directory excluding `node_modules`.

  Right after this open a new terminal tab and write

  `gulp-runtime --tasks default watch serve`


<!-- links -->

[npm]: https://npmjs.com/gulp-runtime
[gulp]: https://github.com/gulpjs/gulp
[RxJs]: https://github.com/Reactive-Extensions/RxJS
[parth]: https://github.com/stringparser/parth
[license]: http://opensource.org/licenses/MIT
[runtime]: https://github.com/stringparser/runtime
[gulp-api]: https://github.com/gulpjs/gulp/blob/master/docs/API.md
[gulp-repl]: https://github.com/stringparser/gulp-repl
[open-a-issue]: https://github.com/stringparser/gulp-runtime/issues/new
[example-gulpfile]: https://github.com/gulpjs/gulp#sample-gulpfilejs
