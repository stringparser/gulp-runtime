/*
 * Module dependencies
 */

var util = require('util');
var merge = require('utils-merge');
var readline = require('readline');
var minimist = require('minimist');

var parseCMD = require('../util/parseCMD');
var completerFn = require('../util/completerFn');
var isEmpty = require('../util/isEmpty');
var prettyfy = require('../util/prettyfy');

/*
 * Expose the `Runtime` interface
 * -----------------------------------
 *  `Runtime` is a suttle modification
 *  of the `readline` core module to provide
 *  some customization.
 *
 *  Added:
 *   - Runtime.prototype.set
 *   - Runtime.prototype.get
 *   - Runtime.prototype.attach
 *
 *   ^ Used to create commands for a CLI.
 */
exports = module.exports = Runtime;

/*
 * module refs (helpers)
 */
var Interface = readline.Interface;

/*
 * `Runtime` constructor
 *
 *   - Inherits from `readline.Interface`
 *   - Only one instance is allowed
 *     (hack) that solves the case when the input
 *     is the same.
 */

var instance;

function Runtime(options){

  if ( !(this instanceof Runtime) ){
    instance = new Runtime(options);
    return instance;
  }
  else if( instance )
    return instance;
  else {

    // attach the readline Interface
    Interface.call(this, options)

    // wire up events
    this._events = listen;
  }
}
util.inherits(Runtime, Interface);

/*
 * Runtime `set` and `get`
 *
 *  - Create runtime commands with this methods.
 *
 *  - Give preference to `context` methods if
 *    present. For `gulp`, `context` is `gulp.task`
 *    and `scope` the `gulp` instance itself.
 *
 *  - The above abstraction is to useful to be
 *    more reasonable on what to pass
 *    to a command when is runned at runtime.
 */
var command = {};

/*
 * Runtime set:
 *  - set a command `key` to run a function
 */

Runtime.prototype.set = function (key, fn){

  if(typeof fn !== 'function')
    throw new Error(
      fn + ' is not a function.'
      + ' You need one to set a command.'
    );

  if(!command[key])
    return command[(key).toString()] = { fn : fn };
  else if(command[key])
    throw new Error('Command "'+key+'" already exists.');
    // ^ Don't override if command exists.
    // Throw error so one can see where source code lives.
    // Can save headaches... or maybe annoying, we'll see :D.
}

/*
 * Runtime `get`:
 *  - get a command `key` for a function
 *
 * If command doesn't exists return false.
 */
Runtime.prototype.get = function(key){

  if(command[key])
    return command[key];
  else if(typeof key === 'undefined')
    return Object.keys(command);
    // > Helper to see all commands
  else
    return false;
}

/*
 * Runtime `handle`:
 *  - called before firing `next`/`done` events.
 *
 */

/*
 * Event handlers for the Interface instance
 *
 *  - `listen` variable holds the Instance events.
 *  - There is only one runtime Instance.
 *  - event's are dispached based on the first argument
 */
var listen = {};

/*
 * handle `line` events
 */
listen.line = function(cmd){

  var args = cmd.trim();

  if( args === '')
    this.emit('done');
  else {

    args = parseCMD(cmd);
    console.log('\n start!')
    this.emit('next', args.argv[0], 0, args);
  }
}

/*
 * handle `start` events
 */
listen.next = function(cmd, index, args){



  var self = this,
      emit = self.emit;

  handle.call(this, 'next', cmd, index, args, function(){

    cmd = args.argv[index];

    if(args.argv[index+1]){
      console.log('\nevent : next');
      emit('next', cmd, index+1, args);
    }
    else {
      console.log('\n\nevent : done');
      emit('done', cmd, index, args);
    }
  })

}

/*
 * handle `done` events
 */
listen.done = function(cmd, index, args){

  var self = this;

  handle.call(this, 'done', cmd, index, args, function(){
    self.prompt();
  })
}

/*
 * Runtime `handle`:
 *  - Changes on the behavior of the
 *    `Runtime` instance should go here.
 *
 *  - `handle` is called whenever a 'next'
 *    or 'done' event is fired, `this` is
 *    set to the current instance.
 *
 *  - API: private
 */

function handle(listener, cmd, index, args, callback){

  console.log(ansiJS(prettyfy(args)))

  callback();
}