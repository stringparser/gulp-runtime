
/*
 * module dependencies
 */
var minimist = require('minimist');

/*
 * Parses arguments and maintains order
 * using minimist
 */
module.exports = function parser(cmd){

  // careful with that axe eugene
  var argv = cmd.replace(/[ ]{2,}/g,' ').split(' ');
  var args = minimist(argv);
      args._ = args._.length === 0 ? null : args._;

  var ret = {
    raw : argv,
    argv : [],
    _ : args._,
    param : {},
    __proto__ : {}
  };

  argv.forEach(function(arg, index){

    var parsed = minimist([arg]);
        parsed._[0] ? parsed = parsed._[0] : delete parsed._;

    var type = typeof parsed;
    var is = type === 'object' ? { object : true } : (
      type === 'string' ? { string : true } : null
    );

    if(is !== null){

      if(is.object){

        Object.keys(parsed).forEach(function(key){
          parsed[key] = args[key];
          ret.param[key] = args[key];
        })
      }
      ret.argv.push(parsed);
    }

  })

  ret.__proto__.get = function(elem){

    return this.argv[this.argv.indexOf(elem)];
  }

  return ret;
}