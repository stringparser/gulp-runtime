
/*
 * Module dependencies
 */

var util = require('../util');
var RuntimeError = require('./error');
var RuntimeWarning = require('./warning');

var merge = util.merge;
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

  if( !(this instanceof Command) )
    return new Command(cmd);


  /*
   * Closure variables
   */
  var root = {};
  var node ;
  var anchor = command[cmd._parent];
  var nest = true;

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

      // put flags always on the root
      if(name[0] === '-'){
        node = root;
      }
      else {
        node = anchor;
      }

      node.children[name] = {
                 fn : fn,
              _name : name,
            _parent : node._name,
           children : {},
         completion : []
      };

      node.completion.push(name);

      if(nest)
        anchor = anchor.children[name];

      i++;
      return this;
    }
    else {
      throw RuntimeError(
        'Command "'+name+'" already exists'+
        ' at command \''+node._name+'\'' +
        ' for the `'+root._name+'` runtime.'
      );
    }

  };

  this.get = function(/* arguments */){

    var args = [].slice.call(arguments);

    if(util.isUndefined(args))
      return merge({}, root);

    var len = args.length;
    var found = anchor;

    args.forEach(function(arg, index){

      if(found && found.children){
        found = found.children[arg];
      }
    });


    return merge({}, found);

  };

  this.version = function(number, comment){

    var args = isOptions(number, comment, 'version', anchor);

    var version = anchor.version = {};

    if(args[0]){
      merge(version, {
        number : args[0]
      })
    }

    if(args[1]){
      merge(version, {
        comment : args[1]
      })
    }

    return this;
  };

  //
  // ## pieces on development, ideas
  //
  util.onDT(this, function(){

    this.nest = function(name){

      nest = name || false;

      if(!anchor.children[name])
        throw RuntimeError(' Command `'+name+'` not defined yet under `'+anchor._name+'`');
      if(nest)
        anchor = anchor.children[name];

      return this;
    }

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
  })
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

function isOptions(/* arguments */){

  var args = [].slice.call(arguments);
  var anchor = args.pop();
  var method = args.pop();

  if(Array.isArray(args))
    return args;
  else {
    return args.map(function(arg){

      if( util.isUndefined(arg) ){
        return { isUndefined : true };
      }

      if(typeof arg === 'function'){
        arg = arg();
      }

      if(typeof arg === 'string')   {
        arg = arg.trim().split(/[ ]+/);
      }

      if(typeof arg === 'object'){

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

}

function whilst(fn){

  var truthy = fn();

  if( truthy )
    whilst(fn);
}