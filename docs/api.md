# document the runtime API

> a runtime interface

If to CLI we add Loop we have REPL. If then from that REPL, we have control over the Read, Print and Loop parts, deciding when to do what, we end up with what I've end up calling *a runtime interface* for a lack of a better name. I've skipped Eval part on purpose since here all what's done is to associate commands to functions, so thats how we "eval" for us mean to run a function encapsulating a command.

So let's spell REPL.

To Read you have to be able to write *commands* that will be interpreted as they arrive the input stream.

Great, lets do that.

[x-node-repl]: https://github.com/joyent/node/blob/master/lib/repl.js#L49
[x-node-readline]: nodejs.org/api/readline.html

### commands

Defining commands we can call them and associate any input to them by their name. You don't have to do that, of course. Just define them. After they are defined, if they have a `handle` they can be run.

#### runtime.set([stems] [, opts])
> arguments above are not positional

Define a command specified by `stems` and/or properties via `opts`.

- `opts` is an `object` or a `function`.
- `stems` is a space separated string or an `array`.

When options is a function it becomes the command `handle`.

Example:

```js
var runtime = require('gulp-runtime');

runtime.set('cmd', function cmdHandle(argv, args, next){
  console.log('cmd was called');
  console.log('args = ', args);
  //
  // lets run another command
  //
  argv = ['afterCmd'].concat(argv);
  next(argv);
});
// ^ will create a command that is callable as `cmd`
// writing `cmd` on the terminal
// or with `runtime.write('cmd')`

runtime.set('afterCmd', function afterCmdHandle(argv, args){
  console.log('afterCmd run ');
  console.log('argv = ["%s"]', argv.join('", "'));
})
```
so when running the script and writing `cmd` on the terminal the command is run

````sh
 > cmd argvOne 2 --flag=param etc
cmd was called
args = { _ : ["argvOne",2,"etc"], flag : "param"}
afterCmd argv = ["argvOne","--flag","etc"]
````
the arguments after `cmd` are passed to its `handle` like so:

 - `argv`: arguments after `cmd` striping parameters
 - `args`: arguments after `cmd` parsed with `minimist`
 - `next`: a function with one optional parameter being that the next command to be run. If the handle **do not** uses `next` (handle.length < 3) then the next on command of the `argv` array will run. If `next` **is used** the next `argv` will not run till `next` is called.

For more details go to the [runtime docs][runtimeDocs]

#### runtime.get([stems] [, opts])

Gets **a copy** of the most similar, previously defined, command specified by `stems`.

- `opts` is an `object`.
- `stems` is a space separated string or an `array`.

A command is an object and has at least 3 properties
 - `_name` : a string with the name of the command
 - `_depth`: an integer representing how far from the root node the command is.
 - `_parent`: a string with the name of the parent for that command.

Obviously the root node has no parent.

The method is made fault tolerant because is not possible to know how much of the input stream is a command and/or what part could be a parameter.

Example:
````js
runtime.set(function rootHandle(argv){
  var notACommand = Boolean(this.get(argv)._parent);
  if( notACommand ){
    this.output.write('Command '+arg.join(' ')+'not defined\n');
  }
});

runtime.set('hello', function helloHandle(){ });
runtime.set('hello world', function helloWorldHandle(){ });

runtime.get('not defined')    // will get the rootNode command
runtime.get('hello world')    // will get the `hello world` command
runtime.get('hello whatever') // will get the `hello` command
````

For more details go to the [runtime docs][runtimeDocs]

[runtimeDocs]: https://github.com/stringparser/runtime/tree/master/docs
