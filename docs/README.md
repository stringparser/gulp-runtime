# Thy `gulp-runtime` docs

  - [Overview](#overview)
  - [Define your commands](#command)
  - [Built-in commands](#Built-ins)
  - [Runtime interface methods](#Interface-methods)
  - [Events](#Events)
  - [`Runtime` constructor](#Review)
    - [Instance's](#Instance's) (instance props and methods)
    - [Runtime.prototype](#Runtime.prototype)


# Overview

The aim of the project is to provide a simple way to hook into the runtime of your code, in this case `gulp`, by meanings of writing *custom commands*. A repl or cli, if you will. But instead of ending after the process has begun, it keeps waiting for `stdin` after it's start.

This is achieved using the [`readline`](nodejs.org/api/readline.html) module (it also could have been done with the [`repl`](nodejs.org/api/repl.html)) and some sugar on top.

To start using this "runtime" CLI / REPL thingy, you include it like so in your code (usually in your `gulpfile` since thats what gets run).

```js
var runtime = require('gulp-runtime');
```

And that's it for now. When you run `gulp` the runtime interface will run and *when you need it* you can press enter to see a prompt like this:

```
 > gulp
```

If you don't like it, you can [change it](#Interface-methods).

# Command

So, how do you write *your own commands*? Since, otherwise, thats the only interest on keeping process open or editing your `gulpfile` anyway (at least for now).

A `command` object is maintained for **all runtime instances** of the same **name**.

## runtime.set(name, handle)

Assigns `name`(s) to a `function`. Supported types:

 -   `name` : `string` or an `array` instance.
 - `handle` : only a function.

 If `name` is a string `key` - `value` pair is created.
 If `name` is an array only the first value of the array is used to create a `key` - `value` pair and the rest is put on an `aliases` object.

 The above can change with time because I don't know if can be a better way to do things. In any case, how this looks like? This is how the `file` flags of `gulp` where implemented.


 ```js
  var gulp = require('gulp');
  var gutil = require('gulp-util');
  var runtime = require('gulp-runtime');
  var semver = require('gulp/node_modules/semver');
  var tildify = require('gulp/node_modules/tildify');
  var cliPackage = require('/usr/lib/node_modules/gulp/package');

  runtime.set(['-v', '--version'], function(){

   var chalk = gutil.colors;
   var modulePackage;

   try {
     modulePackage = require('gulp/package')
   }
   catch(e){
     gutil.log(
       chalk.red('Local gulp not found in'),
       chalk.magenta(tildify(env.cwd))
     );
     gutil.log(chalk.red('Try running: npm install gulp'));
     process.exit(1);
   }

   if (semver.gt(cliPackage.version, modulePackage.version)) {
     gutil.log(chalk.red('Warning: gulp version mismatch:'));
     gutil.log(chalk.red('Global gulp is', cliPackage.version));
     gutil.log(chalk.red('Local gulp is', modulePackage.version));
   }
   else {
     gutil.log('CLI version', cliPackage.version);
     gutil.log('Local version', modulePackage.version);
   }
  });
```

*OMG why you reimplemented that?*

Well, was there other way? If you know, please [issue that bullet](https://github.com/stringparser/gulp-runtime/issues).


## runtime.get([, *arguments*])

  Get the value of the command you setted previously

  - `arguments` can be: `string` or `array` with *only* string content.
