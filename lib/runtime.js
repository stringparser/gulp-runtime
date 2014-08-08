
/*
 * Module dependencies
 */

var fs = require('fs');
var path = require('path');
var caller = require('callsite');
var chalk = require('chalk');

var util = require('./utils');
var terminal = require('./terminal');
var Command = require('./command/constructor');

var merge = util.merge;
var xInterface = terminal.getInterface();

/*
 *
 */

exports = module.exports = {};

/*
 *
 */

var warehouse = {};

/*
 *
 */

function Runtime(name){
  if(!name){
    throw new Error(' A `Runtime` instance need a name (string).');
  }
  else if(typeof name !== 'string'){
    throw new Error(' Runtime\'s instance name should be a `string`');
  }


  if ( !(this instanceof Runtime) ){
    return new Runtime(name);
  }

  var runtime;
  if( !warehouse[name] ){

    // instance's properties
    this._name = name;
    this._timer = {};
    this._config = {
      nested : true
    };
    this.setPrompt(' > '+this._name+' ');

    // instance's functions:
    //  - lexer
    //  - parser
    //  - consumer
    //  - completer
    merge(this, terminal.getDefaults());

    // setup the runtime's namespace
    Command.setRoot(name);

    runtime = function (config){

      if(config){
        runtime.config(config);
      }

      return runtime;
    };

    merge(runtime, this);

    // inform the xInterface
    terminal.setRuntime(runtime);

    // cache it for performance
    warehouse[name] = runtime;

    return runtime;
  }
  else {

    runtime = warehouse[name];
    terminal.setRuntime(runtime);
    return runtime;
  }
}
exports.Runtime = Runtime;

/*
 *
 */

Runtime.prototype.require = function(str){

  if(typeof str !== 'string')
    throw new TypeError(' runtime.require arguments should be a `string`');

  // get and resolve the caller's path
  var stack = caller();
  var site = path.resolve(
    path.dirname(stack[1].getFileName())
  , str);


  var dir;
  try {
      dir = fs.readdirSync(site);
  }
  catch(error){

    throw error;
    error.message = (
      '[' + chalk.yellow('gulp-runtime') +'] \n '
      + util.quotify(error.message)
    )

    throw error;
  }

  dir.filter(function(fileName){

    return /(\.(js|coffee)$)/i.test(path.extname(fileName));
  }).forEach(function(moduleName){

    console.log(moduleName)
    var modulePath = path.resolve(site, moduleName);
    try {
      require(modulePath);
    }
    catch(error){
      console.log(
        chalk.yellow('runtime') +
        ' -> cannot find `' + modulePath + '` \n' +
        error.message.replace(/(')(\S+)(')/g, function($0,$1,$2,$3){

          return $1 + chalk.red($2) + $3;
        })
      );
    }
  });

  return this;
}

/*
 *
 */

Runtime.prototype.set = function(name, handle){

  return (
    new Command(this._name, this._config)
  ).set(name, handle);
};

/*
 *
 */

Runtime.prototype.get = function(/* arguments */){

  var args = Array.isArray(arguments[0]);
      args = args ? arguments[0] : [].slice.call(arguments);

  return (
    new Command(this._name, this._config)
  ).get(args);
};

/*
 *
 */

Runtime.prototype.handle = function(name, handle){

  return (
    new Command(this._name, this._config)
  ).handle(handle);
};

/*
 *
 */

Runtime.prototype.completion = function(stems){

  return (
    new Command(this._name, this._config)
  ).completion(stems);
};

/*
 * doc holder
 */

Runtime.prototype.config = function(obj){

  if(util.isObject(obj)){
    merge(this._config, obj);
    return this;
  } else {
    return this._config[obj];
  }
};

/*
 * doc holder
 */

Runtime.prototype.waiting = function(eventName, fn){

  var timer = this._timer;

  if(!timer[eventName]){

    timer[eventName] = setTimeout(function(){
      xInterface.emit(eventName);

      if(typeof fn === 'function')
        fn();
    });

  } else {

    clearTimeout(timer.startup);
    timer[eventName] = setTimeout(function(){
      xInterface.emit(eventName);

      if(typeof fn === 'function')
        fn();
    });
  }

  return this;
};

/*
 * doc holder
 */

Runtime.prototype.onStartup = function(fn){

  var self = this;

  xInterface.on('startup', function(){
    fn.call(self);
  });

  this.waiting('startup');

  return this;
};



/*
 *  Proxy some readline's xInterface methods
 */
var methods = ['prompt', 'setPrompt'];

methods.forEach(function(method){

  Runtime.prototype[method] = function(/* arguments */){
    xInterface[method].apply(xInterface, [].slice.call(arguments));
    return this;
  };

});


/*
 * Order the prototype by key length
 * just to be nicer to `console.log`s
 */
var unOrdered = Runtime.prototype;
var ordered = {};
var keys = Object.keys(Runtime.prototype);

keys.sort(function(key, next){
  return key.length-next.length;
}).forEach(function(method){
  ordered[method] = unOrdered[method];
});

Runtime.prototype = ordered;
