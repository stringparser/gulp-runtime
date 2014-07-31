
/*
 * Module dependencies
 */

var RuntimeInterface = require('./interface');
var proto = require('./proto');
var merge = require('utils-merge');

exports = module.exports = getRuntime;

function getRuntime(name){

  if(!Handle[name]){
    function runtime(cmd, args, cb){
      if(arguments.length === 1)
        return runtime.command(cmd);
      else
        return runtime.handle(cmd, args, cb);
    }

    runtime._name = name;
    defineGetter(runtime, '_interface', function(){
      return Interface;
    });

    defineGetter(runtime, '_Handle', function(){
      return Handle;
    })

    merge(runtime, proto);


    Handle._currentRuntime = name;
    Handle[name] = runtime;

    return runtime;
  }
  else {

    Handle._currentRuntime = name;
    return Handle[name];
  }
}

var Handle = {};

var Interface = new RuntimeInterface({
  input : process.stdin,
  output : process.stdout
});

defineGetter(Interface, 'handle', function(){
  return Handle._current;
});

defineGetter(Handle, '_current', function(){
  return this[this._currentRuntime];
});

function defineGetter(obj, name, getter) {
  Object.defineProperty(obj, name, {
    configurable: true,
    enumerable: true,
    get: getter
  });
};