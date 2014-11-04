'use strict';

var path = require('path');
var util = require('runtime/lib/utils');
    require('../utils');

function startupChecks(runtime){

  var chalk = util.colors;
  var env = util.whech.sync('gulp');
  var argv = runtime.parser(process.argv.slice(2));

  if( !env.globalPackage.version ){
    runtime.output = process.stdout;
    util.log(util.longBadge);
    util.log(chalk.red('gulp is not installed globally'));
    util.log('Try running: npm install gulp -g');
    return process.exit(1);
  }

  if( !env.localPackage.version ){
    runtime.output = process.stdout;
    util.log(util.longBadge);
    util.log(chalk.red('gulp is not installed locally'));
    util.log('But is globally at', chalk.magenta(
      util.tildify(env.globalDir) + 'gulp@' + env.globalPackage.version
    ));
    util.log('Try running: \'npm link gulp\' or \'npm install gulp\'');
    return process.exit(1);
  }

  if( env.configFile instanceof Error ){
    env.configFile = path.basename(env.configFile);
    runtime.output = process.stdout;
    util.log(util.longBadge);
    util.log(chalk.red('No gulpfile ') + '\'' + env.configFile + '\'');
    util.log(chalk.red(' found from ') + '\'' + env.cwd  + '\'');
    return process.exit(1);
  }

  runtime.config('env', util.merge(env, argv));
}

module.exports = startupChecks;
