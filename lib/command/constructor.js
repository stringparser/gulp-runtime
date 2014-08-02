

var merge = require('utils-merge');
var RuntimeWarning = require('../runtime-warning');
var RuntimeError = require('../runtime-error');
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
  if(cmd._name === cmd._parent)
    root = command[cmd._name] = cmd;
  else
    root = command[cmd._parent];

  this.set = function(name, fn){

    console.log('['+i+']');
    console.log(arguments);
    console.log(anchor);
    console.log(' ---- ');
    if(!anchor.children[name]){

      anchor.children[name] = {
                 fn : fn,
              _name : name,
            _parent : anchor._name,
           children : {},
         completion : []
      };

      if(anchor.completion.indexOf(name) === -1)
         anchor.completion.push(name);

      console.log(' ---- \n Result children: ');
      console.log(anchor.children)
      // The magic line
      // anchor = anchor.children[name];

      console.log(command);
      console.log(' ---- \n Next anchor: ');
      console.log(anchor);
      console.log(' ---- ');

      console.log('-----------')
      if(name === 'second'){
        console.log(command.gulp.children.first)
        console.log(root);
      }

      i++;
      return this;
    }
    else
      throw RuntimeError(
        'Command "'+name+'" already exists'+
        ' for the `'+root._name+'` runtime.'
      );
  }

  this.get = function(argv){

    if(arguments === 0)
      return merge({}, anchor);
    else if(typeof argv === 'string');
      return merge({}, anchor[argv]);
    else if(Array.isArray(argv))
      return RuntimeWarning(
        'Not implemented yet!'
      );

    return this;
  }

  return this;
}

/*
 *
 */
function isCommand(name, fn){

  if(!name)
    throw RuntimeError('Falsey commands like "'+name+'" are not allowed.');
  else if(typeof name !== 'string')
    throw RuntimeError(
      'Command "'+name+"' should be a `string`."
    );
  else if(typeof fn !== 'function')
    throw RuntimeError(
      'Command "'+name+'" `handle` is not a function.'
    );

  return true;
}

function inspect(name, sequence){

  var self = this;
  var current = sequence[sequence.length-1];
  var anchor = current.anchor;

  if(anchor && anchor._parent === anchor._name)
    console.log('\n  `'+anchor._parent+'` runtime definition');
  else
    console.log('')

  console.log('[--------- ')
  console.log(' Sequence ('+i+') = \n', sequence, '\n');
  console.log(' Command ('+i+') = \n', command,'\n');
  console.log('\n[--------- ')

}