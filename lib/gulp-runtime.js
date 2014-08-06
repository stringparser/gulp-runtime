var gulp = require('gulp')
  , gutil = require('gulp-util')
  , tildify = require('gulp/node_modules/tildify')
  , chalk = gutil.colors
  , runtime = new require('./runtime').Runtime('gulp');

runtime.config({
  env : process.env
})

runtime.set(['-v', '--version'], function(){

  var semver = require('gulp/node_modules/semver');
  var tildify = require('gulp/node_modules/tildify');

  var cliPackage = require('/usr/lib/node_modules/gulp/package')
  var modulePackage;

  try {
    modulePackage = require('gulp/package')
  }
  catch(e){
    gutil.log(
      chalk.red('Local gulp not found in'),
      chalk.magenta(tildify(env.cwd))
    );
    gutil.log(chalk.red('Try running: npm install gulp'));
    process.exit(1);
  }

  if (semver.gt(cliPackage.version, modulePackage.version)) {
    gutil.log(chalk.red('Warning: gulp version mismatch:'));
    gutil.log(chalk.red('Global gulp is', cliPackage.version));
    gutil.log(chalk.red('Local gulp is', modulePackage.version));
  }
  else {
    gutil.log('CLI version', cliPackage.version);
    gutil.log('Local version', modulePackage.version);
  }
})

runtime.set(["--tasks", "-T", "--tasks-simple"], function(argv, args, next){

  if(args.T || args.tasks){

    var env = runtime.config('env');
    var taskTree = require('gulp/lib/taskTree');
    var archy = require('gulp/node_modules/archy');

    var tree = taskTree(gulp.tasks);
    tree.label = 'Tasks for ' + chalk.magenta(tildify(env.PWD));
    archy(tree)
      .split('\n')
      .forEach(function (v) {
        if (v.trim().length === 0) {
          return;
        }
        gutil.log(v);
      });
  }
  else if(args['tasks-simple']){

    console.log(Object.keys(gulp.tasks)
      .join('\n')
      .trim()
    );
  }

});

runtime.completion(function(){

  var tasks = Object.keys(gulp.tasks);

  if(tasks.indexOf('default') !== -1)
      tasks.splice(tasks.indexOf('default'), 1);

  return tasks;

}).handle(function(argv, args, next){

  var tasks = argv;

  if( tasks.indexOf('default') !== -1){
    console.log('['+chalk.red('gulp')+'-runtime] The "'+chalk.red('default')+'" task is not avaliable at runtime.');
    tasks.splice(tasks.indexOf('default'), 1);
  }

  tasks.filter(function(name){
    return gulp.tasks[name];
  })

  if(tasks.length !== 0){
    gulp.start(tasks);
  }

})

runtime.set(['--require', '-r', '--gulpfile', '-gf'], function(argv, args, next){

  var file = args.r ? args.r : (
    args.gf ? agrs.gf : (
      args.require ? args.require : (
        args.gulpfile ? args.gulpfile : null
      )
    )
  );

  if(file !== null){

    try {
      require(file);
    }
    catch(error){
      gutil.log(
        chalk.yellow('runtime') + ' -> ' +
        error.message.replace(/(')(\S+)(')/g, function($0,$1,$2,$3){

          return $1 + chalk.red($2) + $3;
        })
      );
    }

    var env = this.config('env');

    gutil.log('Using gulpfile', chalk.magenta(tildify(env.PWD)));
  }
  else {
    gutil.log(
      chalk.yellow('runtime') + ' -> ' +
      'Something went wrong requiring your file.' +
      'Report this issue on Github.'
    );
  }

})

runtime.set(['--cwd'], function(argv, args, next){

  gutil.log('Working directory', chalk.magenta(tildify(process.cwd())));
})