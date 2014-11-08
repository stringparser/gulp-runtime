

## gulp-runtime [<img alt="Gitter" align="right" src="https://badges.gitter.im/Join Chat.svg"/>](https://gitter.im/stringparser/gulp-runtime?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge)

[<img alt="build" src="http://img.shields.io/travis/stringparser/gulp-runtime/master.svg?style=flat-square" align="left"/>](https://travis-ci.org/stringparser/gulp-runtime/builds)

[<img alt="NPM version" src="http://img.shields.io/npm/v/gulp-runtime.svg?style=flat-square" align="right"/>](http://www.npmjs.org/package/gulp-runtime)

<p align="center">
  use
  <a href="https://github.com/gulpjs/gulp" style="color:#D32929;">
    <b>gulp</b>
  </a>
  whilst is running
</p>
<p align="center"><a href="https://github.com/gulpjs/gulp">
  <img height=350 src="./docs/gulp-runtime.png"/>
</a></p>
<h3 align="center" style="border-bottom:0;">
  <a href="./docs">documentation</a>
</h3>

## usage

For a REPL just require the module

```js
 var runtime = require('gulp-runtime');
```
press enter to see the prompt

```sh
[13:07:50] Starting 'default'...
[13:07:50] Finished 'default' after 800 μs
 >
```
run tasks

```sh
> (press tab)
--silent        --tasks         -T              --tasks-simple  -v              --version       --require
--gulpfile      lint            jade            stylus          js
jsx             browserify      default
 > browserify
[14:28:53] Starting 'js', 'jsx', 'browserify' ...
[14:28:53] Finished 'js' after 17 μs, 'jsx' after 21 μs, 'browserify' after 27 μs
```

use the [gulp cli][x-gulp-cli] without exiting the process

````sh
 > --tasks
[14:25:14] Tasks for ~/code/project/gulpfile.js
[14:25:14] ├── lint
[14:25:14] ├── jade
[14:25:14] ├── stylus
[14:25:14] ├── js
[14:25:14] ├── jsx
[14:25:14] ├─┬ browserify
[14:25:14] │ ├── js
[14:25:14] │ └── jsx
[14:25:14] └─┬ default
[14:25:14]   ├── lint
[14:25:14]   ├── jade
[14:25:14]   ├── stylus
[14:25:14]   └── browserify
````

or run gulpfiles directly

````sh
$ node project/gulpfile.js browserify
[13:35:56] From plugin `gulp-runtime`
[13:35:56] Working directory changed to ~/code/project
[13:35:56] Using gulpfile ~/code/project/gulpfile.js
[14:28:53] Starting 'js', 'jsx', 'browserify' ...
[14:28:53] Finished 'js' after 17 μs, 'jsx' after 21 μs, 'browserify' after 27 μs  
 >
````

### what's in
- A hackable CLI/REPL with standard shell behavior.
- A [runtime interface][x-runtime]: communicate with the REPL using code.
- Extras:
   + Run [gulp][x-gulp] directly from a `gulpfile`.
   + Log task code to the terminal using `--log-task` (yep, I am  that lazy).

Read the [documentation](#documentation) for more information about all the above.

### install

With [npm][x-npm]

    npm install --save-dev gulp-runtime

<div align="center">
  <img src="https://nodei.co/npm/gulp-runtime.png?downloads=true&downloadRank=true&stars=true" alt="NPM"/>
</div>

## todo

 - [ ] review the documentation
 - [ ] review the CLI (`--cwd` is missing at the moment)

## license

[<img alt="LICENSE" src="http://img.shields.io/npm/l/gulp-runtime.svg?style=flat-square"/>](http://opensource.org/licenses/MIT)


[x-npm]: https://www.npmjs.org
[x-gulp]: https://github.com/gulpjs/gulp
[x-gulp-cli]: https://github.com/gulpjs/gulp/blob/master/docs/CLI.md

[x-runtime]: https://github.com/stringparser/runtime
[x-through2]: https://www.npmjs.org/package/through2
