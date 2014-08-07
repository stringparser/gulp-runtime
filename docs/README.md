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

How do you write *your own commands*? Since, otherwise, thats the only interest on keeping process open (at least for now).

## runtime.set(name, handle)

Assigns command `name` to a `function`.

Supported types:

 -   `name` : `string` or an `array` instance.
 - `handle` : only a function.

 If `name` is a string, a `key` - `value` pair is created.
 If `name` is an array, only the first value of the array is used to create a `key` - `value` pair and the rest is put on an `aliases` object.

 The above can change with time because I don't know if can be a better way to do things. In any case, how this looks like? This is how the `file` flags of `gulp` where implemented.


 ```js
  //
  // For brevity all `requires` were omitted here
  //
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

  Get the `object` that represents the command you setted previously.

  - `arguments` can be: `string` or `array` with *only* string content. If no arguments where given it will output the whole object representing the "namespace" of the runtime.

  Following the example above, `runtime.get('-v')` (or `--version') would log

```js
{ handle: [Function],
  _name: '-v',
  _depth: 1,
  _parent: 'gulp',
  aliases: {},
  children: {},
  completion: [] }
```

  Se the whole picture of the `runtime.set(['-v', '--version'], function(){ ... }` above you can log `runtime.get()` with *no* arguments given returning the `root` node of the `gulp` namespace

```js
{ _name: 'gulp',
  _depth: 0,
  _parent: 'gulp',
  aliases: { '--version': '-v' },
  children:
   { '-v':
      { handle: [Function],
        _name: '-v',
        _depth: 1,
        _parent: 'gulp',
        aliases: {},
        children: {},
        completion: [] } },
  completion: [ '-v', '--version' ] }

```

  As you can see only the first element of the array created an `aliases` key-value pair so we don't have too much overhead.

## runtime.completion(stems)

  Provide the completion that will be displayed at runtime for that node of the `command` object.

  - `stems` : can be
    - `array` with *only* `string` content.
    - a `function` returning an `array` instance with *only* `string` content.

  The elements of the array will be added to the node's completion, *if* they are not already there.

 - #### Example: gulp task avaliable for `onTab` completion

