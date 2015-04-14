# API documentation

If to CLI we add Loop we have REPL. If then from that REPL, we have control over the Read, Print and Loop parts, deciding when to do what, we end up with what I've end up calling *a runtime interface* for a lack of a better name. I've skipped Eval part on purpose since what we do here is associate commands to functions, so "eval" for us meants to run a function we chose to encapsulate a command action.

All of the above is implemented in the [runtime][x-runtime] module. Go there for [more extensive docs][x-runtime-docs].

What's covered here is:

 - **runtime.set** - set command(s)
 - **runtime.get** - get a command previously set
 - **runtime.prompt** - writes the prompt text to the output stream
 - **runtime.setPrompt** - changes the prompt text

## Runtime

Out of the module you get a pre implemented [`Runtime`][x-runtime] instance with gulp's CLI commands and your tasks (see [CLI/REPL docs](cli-repl.md)).

```js
var runtime = require('gulp-runtime');
```

The runtime instance inherits from node core's [readline.Interface][x-readline-interface] which is an event emitter with an `input` and `output` streams.

The `readline.Interface` provides a lot of the things we give for granted today of a terminal:
  - <kbd>Ctrl</kbd>+<kbd>L</kbd> cleans the screen,
  - <kbd>Ctrl</kbd>+<kbd>U</kbd> clears the line,
  - <kbd>Ctrl</kbd>+<kbd>C</kbd> exists the process,
  - <kbd>Up/Down</kbd> for history.
  - etc.

For more information about these and more stuff, read the [readline][x-readline] documentation to see what events are emitted and which methods make its API.

### commands

Commands can be `set` and `get`. After a command is defined, if they have a `handle` they can be run.

#### runtime.set([stems] [, opts])

Define a command specified by `stems` that has properties `opts`.

- `opts` can be an `object` or a `function`.
- `stems` is a space separated string or an `array` of `strings`.

If **opts is a function** it becomes the command `handle` property.

Example:

```js
var runtime = require('gulp-runtime');

runtime.set('cmd', function cmdHandle(argv, args, next){
  console.log('cmd was called');
  console.log('argv = ', argv, 'args = ', args);
  next(); // go to the next command using argv
});
```
Then, on the terminal

````sh
 > cmd argvOne 2 --flag=param etc
cmd was called
argv = ['argvOne', '--flag', 'etc']
args = { _ : ['argvOne',2,'etc'], flag : 'param'}
````

 - `argv`: arguments after `cmd` striping parameters
 - `args`: arguments after `cmd` parsed with `minimist`
 - `next`: dispatch the next command. If the handle **does not** use `next` (handle.length < 3) the next command on the `argv` array will run. If `next` **is used** the next `argv` will not run till `next` is called.

Example:
````js
runtime.set('cmd', function cmdHandle(argv, args, next){
  console.log('cmd was called');
  console.log('argv = ', argv, 'args = ', args);
  next(['otherCmd'].concat(argv.concat('world', '--pirate=flag')));
});
runtime.set('otherCmd', function otherCmdHandle(argv, args){
  console.log('otherCmd was called');
  console.log('argv = ', argv, 'args = ', args);
})
````
on the terminal

````sh
 > cmd hello
 cmd was called
 argv = ['hello']
 args = { _ : ['hello'] }
 otherCmd was called
 argv = ['hello', 'world', '--pirate']
 args = { _ : ['hello', 'world'], pirate: 'flag' }
````

More details on [runtime docs][x-runtime-docs]

#### runtime.get([stems])

Get **a clone** of the most similar, command specified by `stems`. *If* there is *no match* a clone of the `rootNode` is returned instead.

- `stems` is a space separated string or an `array`.

A command is an object and has at least 3 properties
 - `_name` : a string with the name of the command
 - `_depth`: an integer representing how far from the root node the command is.
 - `_parent`: a string with the name of the parent for that command.

Obviously the root node has no parent.

The method is made fault tolerant because is not possible to know how much of the input is a command and/or what part could be a parameter.

Example:
````js
runtime.set(function rootNodeHandle(argv){
  var notACommand = Boolean(this.get(argv)._parent);
  if( notACommand ){
    this.output.write('Command '+arg.join(' ')+'not defined\n');
  }
});

runtime.set('hello', function helloHandle(){ });
runtime.set('hello world', function helloWorldHandle(){ });

runtime.get('not defined')    // will get the rootNode command
runtime.get('hello whatever') // will get the `hello` command
runtime.get('hello world')    // will get the `hello world` command
````

More details on [runtime docs][x-runtime-docs]

#### runtime.setPrompt(text, length)

Inherited from the [readline.Interface][x-readline-interface]. Set the text of the prompt and its length (useful if you want colors there).

De default prompt is ` > `.

#### runtime.prompt([preserveCursor])

From [readline.Interface][x-readline-interface] docs

<blockquote>
Readies readline for input from the user, putting the current setPrompt options on a new line, giving the user a new spot to write. Set preserveCursor to true to prevent the cursor placement being reset to 0.

This will also resume the input stream used with createInterface if it has been paused.
</blockquote>

[x-repl]: https://github.com/joyent/node/blob/master/lib/repl.js#L49
[x-readline]: http://nodejs.org/api/readline.html
[x-readline-interface]: http://nodejs.org/api/readline.html#readline_class_interface

[x-runtime]: https://github.com/stringparser/runtime
[x-runtime-docs]: https://github.com/stringparser/runtime/tree/master/docs
