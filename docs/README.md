# Thy docs

  <img align="right" src="./gulp-runtime.png"/>
  - [Overview](#overview)
  - [Fast forward (no jibber jabber, just code)](#fast-forward)
  - [Define your commands](#the-command-object)
    - [`runtime.set(name, handle)`](#runtimesetname-handle)
    - [`runtime.get([, arguments])`](#runtimeget-arguments)
    - [`runtime.completion(stems)`](#runtimecompletion-stems)
    - [`runtime.handle(handle)`](#runtimehandle-handle)
    - [Chaining `set`, `get`, `completion` and `handle` methods](#chaining-methods)
  - [Built-in commands](#Built-ins)
  - [Runtime interface methods](#Interface-methods)
  - [Events](#Events)
  - [`Runtime` constructor](#Review)
    - [Instance's](#Instance's) (instance props and methods)
    - [Runtime.prototype](#Runtime.prototype)


# Overview [![progressed.io](http://progressed.io/bar/100)](https://github.com/fehmicansaglam/progressed.io)

The aim of the project is to provide a simple way to hook into the runtime of your code, in this case `gulp`, by meanings of writing *custom commands*. A repl or cli, if you will. That is: instead of ending after the process has begun, it keeps waiting for `stdin` after it's start.

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

Before the actual API, a *fast forward* section for those like me with no patience for the developer's ego.

# Fast-forward [![progressed.io](http://progressed.io/bar/0)](https://github.com/fehmicansaglam/progressed.io)

A null-documented section: just use cases.

[Fire questions](../issues/new) on what you want to have included here.

Now to the actual API.

# Command

> Ok, ok, enough!!

> ... how do I write *my own* commands?

In fact is very simple. I've spent some time to make it as simple and fast as I can.

> Show me the code.

...all right. This is how one would write the *whole* gulp cli namespace

```js
var runtime = require('gulp-runtime');

runtime({ nested : false })
  .set('--cwd', function(argv, args, next){ /*...*/ })
  .set('--silent', function(argv, args, next){ /*...*/ })
  .set('--require', function(argv, args, next){ /*...*/ })
  .set('--gulfile', function(argv, args, next){ /*...*/ })
  .set(['-v', '--version'], function(argv, args, next){ /*...*/ })
  .set(['--color', '--no-color'], function(argv, args, next){ /*...*/ })
  .set(['-T','--tasks', '--tasks-simple'], function(argv, args, next){ /*...*/ })
```

 * `argv` : `array` of the things you wrote on the terminal minus all the parameters (numbers, etc).
 * `args` : the parsed `argv` of what you actually wrote (in this case I've chosen [minimist](https://github.com/substack/minimist), you can use whichever you want, more on that later)
 * `next` : its under development, but you can imagine its use would be to go to the next command, if you wrote

 > command0 command1 command2

and you are on `command0`, it would take you to `command1`.

But I insist: *it will change*.

One thing, all the code above, has generated this `command object`.

```js
{ _name: 'gulp',
  _depth: 0,
  _parent: 'gulp',
  aliases:
   { '--version': '-v',
     '--no-color': '--color',
     '--tasks': '-T',
     '--tasks-simple': '-T' },
  children:
   { '--cwd':
      { handle: [Function],
        _name: '--cwd',
        _depth: 1,
        _parent: 'gulp',
        aliases: {},
        children: {},
        completion: [] },
     '--silent':
      { handle: [Function],
        _name: '--silent',
        _depth: 1,
        _parent: 'gulp',
        aliases: {},
        children: {},
        completion: [] },
     '--require':
      { handle: [Function],
        _name: '--require',
        _depth: 1,
        _parent: 'gulp',
        aliases: {},
        children: {},
        completion: [] },
     '--gulfile':
      { handle: [Function],
        _name: '--gulfile',
        _depth: 1,
        _parent: 'gulp',
        aliases: {},
        children: {},
        completion: [] },
     '-v':
      { handle: [Function],
        _name: '-v',
        _depth: 1,
        _parent: 'gulp',
        aliases: {},
        children: {},
        completion: [] },
     '--color':
      { handle: [Function],
        _name: '--color',
        _depth: 1,
        _parent: 'gulp',
        aliases: {},
        children: {},
        completion: [] },
     '-T':
      { handle: [Function],
        _name: '-T',
        _depth: 1,
        _parent: 'gulp',
        aliases: {},
        children: {},
        completion: [] } },
  completion:
   [ '--cwd',
     '--silent',
     '--require',
     '--gulfile',
     '-v',
     '--version',
     '--color',
     '--no-color',
     '-T',
     '--tasks',
     '--tasks-simple' ] }
```

The structure of the object above can change with time because I don't know if there could be a better way to do things.

What will be kept as is right now: `handle` and `completion`.

# The `Command` object

The object above has its own [constructor](../lib/command/constructor.js) but is not exposed directly. Instead is used through the methods below which, are chainable:

    - [`runtime.set(name, handle)`](#runtimesetname-handle)
    - [`runtime.get([, arguments])`](#runtimeget-arguments)
    - [`runtime.completion(stems)`](#runtimecompletion-stems)
    - [`runtime.handle(handle)`](#runtimehandle-handle)

By default each use of the `set` method will nest the command one step after the last written command. That means, writting this:

```js
runtime.set('hello', function(argv, args, next){ /*...*/ })
       .set('world', function(argv, args, next){ /*...*/ })
```

will result on this `command object`

```js
{ _name: 'gulp',
  _depth: 0,
  _parent: 'gulp',
  aliases: {},
  children:
   { hello:
      { handle: [Function],
        _name: 'hello',
        _depth: 1,
        _parent: 'gulp',
        aliases: {},
        children:
         { world:
            { handle: [Function],
              _name: 'world',
              _depth: 2,
              _parent: 'hello',
              aliases: {},
              children: {},
              completion: [] } },
        completion: [ 'world' ] } },
  completion: [ 'hello' ] }
```

The `hello` handle will only be run if you write `hello` and the `world` handle will be run if you write `hello world`. As you also can see the completion of that command was also filled in. If you like to unnest just write.

```js
runtime({ nested : false})
  .set('hello', function(argv, args, next){ /*...*/ })
  .set('world', function(argv, args, next){ /*...*/ })
```

will results in

```js
{ _name: 'gulp',
  _depth: 0,
  _parent: 'gulp',
  aliases: {},
  children:
   { hello:
      { handle: [Function],
        _name: 'hello',
        _depth: 1,
        _parent: 'gulp',
        aliases: {},
        children: {},
        completion: [] },
     world:
      { handle: [Function],
        _name: 'world',
        _depth: 1,
        _parent: 'gulp',
        aliases: {},
        children: {},
        completion: [] } },
  completion: [ 'hello', 'world' ] }
```

Simple, right?

## runtime.set(name, handle)

Assigns command(s) `name` to a `function`.

Supported types:

 -   `name` : a `string` or an `array` instance.
 - `handle` : a function.

 If `name` is a string, a `key` - `value` pair is created.
 If `name` is an array, only the first value of the array is used to create a `key` - `value` pair and the rest is put on an `aliases` object.

How this looks like? This is how the `version` flags of `gulp` were implemented.


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

> *OMG* why you reimplemented that?

Well, I just copy-pasted most of it.

- First, just to see how easy would it be to do a cli with this.
- Second, was there other way to make it work? If you know how, please [issue that bullet](https://github.com/stringparser/gulp-runtime/issues).


## runtime.get([, *arguments*])

This `method` represents the command you set previously.

`arguments` can be:
  - A `string`.
  - An `array`.
  - Or an `arguments` object.

All of the above with *only* string content.

If no arguments given it will output the whole object representing the "namespace" of the runtime. That is, the `object` representing what commands you wrote for your `gulp` day.

Example: `runtime.get('-v')` of the previous section (or `--version') would log

```js
{ handle: [Function],
  _name: '-v',
  _depth: 1,
  _parent: 'gulp',
  aliases: {},
  children: {},
  completion: [] }
```

So now, of course, you want to see the the whole picture of what the above `runtime.set(['-v', '--version'], function(){ ... }` did. For that, log `runtime.get()` with *no* arguments.

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

Changes on that object will have *no* effect on the actual object that is used. What you get back of the `runtime.get()` method is a *copy* of the object with no reference attached.

If you want to know why, [ask](https://github.com/stringparser/gulp-runtime/issues/new).

## runtime.completion(stems)

Provide the completion that will be displayed at runtime for that node of the `command` object.

`stems` could be:
  - An `array` with *only* `string` content.
  - A `function` returning an `array` instance with *only* `string` content.

The elements of the array will be added to the node's completion, *if* they are not already there.


#### Example: gulp task avaliable for `onTab` completion


## Chaining methods