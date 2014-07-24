// module dependencies
var minimist = require('minimist');
var readline = require('readline');
var PluginError = require('gulp-util').PluginError;
var color = require('gulp-util').colors;

// createInterface:
//  - Provide getters and setters for new CMDs
//  - emit events for useful situations:
//     + empty line
//     + on `--param` (hypenated command -> param)
//     + on `command` (nonhypen. -> command)
module.exports = function createInterface(plugin, scope){

  // make a readline interface
  var cli = readline.createInterface({
       input : process.stdin,
      output : process.stdout
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
    else if(arguments.length === 0)
      return Object.keys(cmd);
  }

  // initialize scope
  scope = scope || cli;

  // on flush make the plumbing
  cli.on('line', function onInterfaceFlush(cmd){

    cmd = cmd.trim();

    if( cmd === '')
      cli.emit('empty', scope);
    else {

      var args = parseCMD(cmd);
      var cmdLen = args.cmd.length;
      var paramLen = Object.keys(args.param).length;

/*      console.log('interface.js')
      console.log(args)
      console.log('  cmdLen = %s ; paramLen = %s', cmdLen, paramLen);*/

      if(cmdLen !== 0)
        cli.emit('command', args, scope);

      if(paramLen !== 0)
        cli.emit('--param', args, scope);
    }

  }).on('empty', function onEmpty(){

    cli.prompt();
  });

  return cli;
}

// on `tab` completer
// structure taken from node's documentation
function completerFn(line){

  var completions = this.get();

  if(completions.length !== 0){
    var hits = completions.filter(function(c) {
        return c.indexOf(line) == 0;
      });
    // show all completions if none found
    return [hits.length ? hits : completions, line];
  }
  else
    return [ [''], line];
}

// Parses args (cmd) and separates
// them using minimist.
// - Ugly but works
function parseCMD(cmd){

  cmd = cmd.trim();
  // careful with that axe eugene
  var command = cmd.replace(/[ ]{2,}/g,' ').split(' ');
  var args = minimist(command);
    command = args._;
    delete args._;

  return {
      raw : cmd,
      cmd : command,
    param : args
  };
}