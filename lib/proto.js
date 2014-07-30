/*
 * Module dependencies
 */

var RuntimeInterface = require('./interface');
var RuntimeError = require('./runtime-error');
var RuntimeWarning = require('./runtime-warning');

//
// ##
//
var runtime = exports = module.exports = {};

var instance = new RuntimeInterface({
   input : process.stdin,
  output : process.stdout
})

//
// ##
//
runtime.handle = function(key, fn){

  if(!key)
    return Object.keys(runtime_command);
  else if(typeof key !== 'string')
     throw RuntimeError(
      'Command "'+key+"' should be a `string`."
    );

  if(arguments.length === 1)
    return runtime_command[key.trim()];
  else if(typeof fn !== 'function')
    throw RuntimeError(
      'Command "'+key+"' `handle` is not a function."
    );

  key = key.split(/[ ]+/g);

  if(!runtime_command[key[0]]){

    runtime_command[key] = { fn : fn };
    if(key.slice(1)[0])
      runtime_command[key].argv = key.slice(1);
  }
  else if(runtime_command[key])
    throw RuntimeError('Command "'+key+'" already exists.');
    // ^ Don't override if command exists.
    // Throw error so one can see where source code lives.
    // Can save headaches... or maybe annoying, we'll see :D.

}

//
// ##
//
runtime.setPrompt = function(prompt_text, prompt_length){
  if(prompt_length)
    instance.setPrompt(prompt_text, prompt_length);
  else
    instance.setPrompt(prompt_text);
}

//
// ##
//
runtime.prompt = function(){
  instance.prompt();
}

//
// ##
//
runtime.emit = function(/* arguments */){
  instance.emit.apply(instance,
    [].slice.call(arguments)
  );
}

//
// ##
//
runtime.onStartup = function(fn){
  if(typeof fn === 'function')
    instance.on('startup', fn);
  else
    throw RuntimeError('`' + fn + '` must be a function');
}

//
// ##
//
runtime.onDone = function(fn){
  if(typeof fn === 'function')
    instance.on('done', fn);
  else
    throw RuntimeError('`' + fn + '` must be a function');
}

//
// ##
//
var command = {}, runtime_command = {};

//
// ##
//
runtime.set = function(key, fn){

  if(!key)
    throw RuntimeError('Falsey commands like '+key+' are not allowed.');
  else if(typeof key !== 'string')
     throw RuntimeError(
      'Command "'+key+"' should be a `string`."
    );
  else if(typeof fn !== 'function')
    throw RuntimeError(
      'Command "'+key+"' `handle` is not a function."
    );

  key = key.trim().split(/[ ]+/g);

  if(runtime_cmd[key[0]])
    throw RuntimeError(
      'Command `' + key[0] +'` already exists as a `'
      + this.runtime_name + '` command.'
    );
  else if(!command[key[0]]){

    command[key] = { fn : fn };

    if(key.slice(1)[0])
      command[key].argv = key.slice(1);
  }
  else if(command[key])
    throw RuntimeError('Command "'+key+'" already exists.');
    // ^ Don't override if command exists.
    // Throw error so one can see where source code lives.
    // Can save headaches... or maybe annoying, we'll see :D.

}

//
// ##
//
runtime.get = function(key){

  if(typeof key === 'undefined')
    return Object.keys(command);
    // > Helper to see all commands
  else if(command[key])
    return command[key];
  else if(key === this.runtime_name)
    return runtime_command[key];
  else
    return false;
}