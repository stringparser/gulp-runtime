

var RuntimeWarning = require('../runtime-warning');
var RuntimeError = require('../runtime-error');
var prettyfy = require('../../util/prettyfy')

var command = {}
var anchor, i = -1;

exports = module.exports = RuntimeCommand;

function RuntimeCommand(key, cmd){

  if( !(this instanceof RuntimeCommand) ){
    return new RuntimeCommand(key, cmd);
  }

  i++;

  console.log('\n Arguments ('+i+'): \n ', arguments);

  var self = this;

  if( !this._anchor && cmd && !command[cmd._name]){
    command[cmd._name] = {
           _name : cmd._name,
          _depth : 0,
        children : {},
      completion : []
    }
  }

  console.log('\n Anchor (before): \n ', anchor)

  if(!this._anchor)
    anchor = command[cmd._name];
  else
    anchor = anchor[cmd._name];

  this._anchor = cmd._name;
  this._name = key;

  this.set = function(key, fn){

    console.log(
       '\n New key "'+key+'"'
      +' for anchor `'+this._anchor+'` \n ',
      anchor
    );

    key = key.trim();
    this.isCommand(key, fn);

    var child = anchor.children;

    if(!child[key]){

      if(anchor._depth && !anchor.completion[0])
        anchor._depth++;

      child[key] = {
             _name : key,
                fn : fn,
          children : {},
        completion : []
      };

      anchor.completion.push(key);

      console.log('\n Anchor (after):\n ', anchor);
      console.log('\n   Child:\n   ', child, '\n');

      return new RuntimeCommand(key, child[key]);

    }
    else
      throw RuntimeError('Command "'+key+'" already exists.');
      // ^ Don't override if command exists.
      // Throw error so one can see where source code lives.
      // Can save headaches... or maybe annoying, we'll see :D.
  }

  this.get = function(key){

    console.log('\n Getting `'+key+'` with `'+cmd._name+'`')
    console.log('  anchor : ', command[this._anchor]);

    var depth = 0, found;
    while(depth < anchor._depth){

      console.log('depth = %s ; anchor._depth = %s', depth, anchor._depth);

      found = anchor.completion.indexOf(key);
      if( found !== -1){
        console.log('\n Found "'+key+'" at '+found+' on: \n',anchor)
        found = anchor.children[anchor.completion[found]];
      }
      else
        console.log('\n Not found "'+key+ '" on: \n',anchor)

      depth++;
    }

    return found;
  }

  this.completion = function(options){

    prettyfy.color(' Fill command completion');
    var comp;
    if(Array.isArray(options))
      comp = options;
    else if(typeof options === 'function' && Array.isArray(options()))
      comp = options();
    else
      throw RuntimeError({
        message : 'Command completion is either: '
              +   ' - An array'
              +   ' - A function returning an array'
      });

    if(!cmd.completion)
      cmd.completion = comp;
    else
      cmd.completion = cmd.completion.concat(comp);
  }

  this.command = function(key, fn){

    console.log('\n Using `command` with anchor ', anchor);
    console.log(' key = %s ; fn =', key, fn)
    return (
      new RuntimeCommand(key, anchor)
    ).set(key, fn);
  }
}

RuntimeCommand.prototype.isCommand = function(key, fn){

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

  return true;
}

