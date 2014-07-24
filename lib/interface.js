// module dependencies
var minimist = require('minimist');
var readline = require('readline');
var PluginError = require('gulp-util').PluginError;
var color = require('gulp-util').colors;

// createInterface:
//  - Provide getters and setters for new CMDs
//  - emit events for useful situations:
//     + empty line
//     + one --arg
//     + several --args
module.exports = function createInterface(plugin, scope){

  // make a readline interface
  var cli = readline.createInterface({
       input : process.stdin,
      output : process.stdout,
      completer : completerFn.bind(scope)
  });

  // prompt
  cli.setPrompt(plugin.promptText, plugin.promptText.length);

  // commands
  var cmd = {};

  // give setters and getters for new runtime commands
  cli.set = function setRuntimeCMD(key, cb){
    if(typeof cb !== 'function')
      throw new PluginError({
        plugin : plugin.name,
        message : 'Give a callback as a second parameter.'
      });
    else if(key)
      cmd[(key).toString()] = cb;
    else
      throw new PluginError({
        plugin : plugin.name,
        message : 'To set a command give a key to identify it.'
      });
  };

  cli.get = function getRuntimeCMD(key){
    if(cmd[key])
      return cmd[key];
    else
      return cmd;
  }

  // initialize scope
  scope = scope || cli;

  // on flush make the plumbing
  cli.on('line', function onInterfaceFlush(cmd){

    var args = parseCMD(cmd);
    var cmdLen = args.cmd.length;
    var paramLen = Object.keys(args.param).length;

    if(cmdLen === 1)
      cli.emit('command', cmd, scope);
    else if(cmdLen !== 0)
      cli.emit('commands', cmd, scope);

    if(paramLen === 1)
      cli.emit('--param', cmd, scope);
    else if(paramLen !== 0)
      cli.emit('--params', cmd, scope);

    console.log(cmd)

  }).on('empty', function onEmpty(){

    cli.prompt();
  });

  return cli;
}

// on `tab` completer
// structure taken from node's documentation
function completerFn(line){

  var completions = Object.keys(this.get());
  console.log(comletions);
  var hits = completions.filter(function(c) {
    return c.indexOf(line) == 0;
  });
  // show all completions if none found
  return [hits.length ? hits : completions, line];
}

// Parses args (cmd) and separates
// them using minimist.
// - Ugly but works
function parseCMD(cmd){
  // careful with that axe eugene
  cmd = cmd.trim().replace(/[ ]{2,}/g,' ');
  var args = minimist( cmd.split(' ') );
  cmd = args._;
  delete args._;
  var param = args;

  return {
    cmd : cmd,
    param : param
  }
}