
/*
 * Module dependencies
 */

var util = require('./utils');
var terminal = require('./terminal');
var Command = require('./command/constructor');

var merge = util.merge;

/*
 *
 */

exports = module.exports = {};

/*
 *
 */

var warehouse = {};
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
  else if( !warehouse[name] ){

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

    function runtime(config){

      if(!util.isObject(config))
        merge(runtime.config, config);

      return runtime;
    };

    merge(runtime, this);

    // inform the interface
    terminal.setRuntime(runtime);

    // cache it for performance
    warehouse[name] = runtime;

    return runtime;
  }
  else {
    var runtime = warehouse[name];
    terminal.setRuntime(runtime)
    return runtime;
  }
}
exports.Runtime = Runtime;

/*
 *
 */

Runtime.prototype.set = function(name, handle){

  return (
    new Command(this._name, this.config)
  ).set(name, handle);
};

/*
 *
 */

Runtime.prototype.get = function(/* arguments */){

  var args = Array.isArray(arguments[0]);
      args = args ? arguments[0] : [].slice.call(arguments);

  return (
    new Command(this._name, this.config)
  ).get(args);
};

/*
 *
 */

Runtime.prototype.handle = function(name, handle){

  if(!handle && name){
    handle = name;
    name = this._name;
  }

  return (
    new Command(this._name, this.config)
  ).handle(handle);
};

/*
 *
 */

Runtime.prototype.completion = function(name, stems){

  if(!stems && name){
    stems = name;
    name = this._name;
  }

  return (
    new Command(this._name, this.config)
  ).completion(stems);
};

Runtime.prototype.config = function(obj){

  if(util.isObject(obj))
    merge(this._config, obj);
  else
    return this._config[obj];
}


/*
 *  Proxy some readline's Interface methods
 */
var methods = ['prompt', 'setPrompt'];
var xInterface = terminal.getInterface();

methods.forEach(function(method){

  Runtime.prototype[method] = function(/* arguments */){
    xInterface[method].apply(xInterface, [].slice.call(arguments));
  };

});


/*
 * Order the prototype by key length
 * just to be nicer to `console.log`s
 */
var unOrdered = Runtime.prototype;
var ordered = {};
var keys = Object.keys(Runtime.prototype)

keys.sort(function(key, next){
  return key.length-next.length;
}).forEach(function(method){
  ordered[method] = unOrdered[method];
});

Runtime.prototype = ordered;