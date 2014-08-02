
/*
 * Module dependencies
 */

var util = require('../util');
var RuntimeError = require('./error');
var RuntimeWarning = require('./warning');

/*
 *
 */
var command = {}, i = 0;
/*
 *
 */
exports = module.exports = Command;
/*
 *
 */
function Command(cmd){

  /*
   * Closure variables
   */
  var anchor = command[cmd._parent];
  var root = {};

  /*
   * Make the root
   */
  if(cmd._name === cmd._parent){
    root = command[cmd._name] = cmd;
  }
  else {
    root = command[cmd._parent];
  }

  this.set = function(name, fn){

    isCommand(name, fn);

    if(anchor.completion.indexOf(name) === -1){

      anchor.children[name] = {
                 fn : fn,
              _name : name,
            _parent : anchor._name,
           children : {},
         completion : []
      };

      anchor.completion.push(name);

      // The magic line
      anchor = anchor.children[name];

      i++;
      return this;
    }
    else {
      throw RuntimeError(
        'Command "'+name+'" already exists'+
        ' for the `'+root._name+'` runtime.'
      );
    }

  };

  this.get = function(argv){

    if(argv === cmd._parent){
      return util.merge({}, anchor);
    }
    if(typeof argv === 'string'){
      return util.merge({}, anchor.children[argv]);
    }
    if(Array.isArray(argv)){
      return RuntimeWarning(
        'Not implemented yet!'
      );
    }

    return this;
  };

  this.version = function(number, comment){

    var args = isOptions([number, comment], 'version', anchor);

    var version = anchor.version = {};

    if(args[0]){
      util.merge(version, {
        number : args[0].join(' ')
      })
    }

    if(args[1]){
      util.merge(version, {
        comment : args[1].join(' ')
      })
    }

    return this;
  };

  this.completion = function(arr){

    arr = isOptions([arr], 'completion', anchor)[0];

    var completion = anchor.completion;

    arr.forEach(function(elem){

      if(completion.indexOf(elem) === -1){
        completion.push(elem);
      }

    });

    return this;
  };

  return this;
}

/*
 *
 */
function isCommand(name, fn){

  if(!name){
    throw RuntimeError('Falsey commands like "'+name+'" are not allowed.');
  }
  else if(typeof name !== 'string'){
    throw RuntimeError(
      'Command "'+name+"' should be a `string`."
    );
  }
  else if(typeof fn !== 'function'){
    throw RuntimeError(
      'Command "'+name+'" `handle` is not a function.'
    );
  }

  return true;
};

function isOptions(args, method, anchor){

  return args.map(function(arg){

    if( util.isUndefined(arg) ){
      return arg;
    }

    if(typeof arg === 'function'){
      arg = arg();
    }

    if(typeof arg === 'string')   {
      arg = arg.trim().split(/[ ]+/);
    }

    if(!Array.isArray(arg)){

      method = method[0].toUpperCase() + method.substring(1);

      throw RuntimeError(
       + ' Type `'+arg+'` unsupported for "' + anchor._name+'"' + '\n'
       +  method + ' supports arguments as:' + '\n\n'
       + '  - `strings` separated by space'  + '\n'
       + '  - `function` returning an Array' + '\n'
       + '  - `Array`'                       + '\n'
      );
    }

    return arg;

  });

}