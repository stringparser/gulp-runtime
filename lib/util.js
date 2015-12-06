'use strict';

exports = module.exports = {};

// dependencies
//
exports.log = require('gulp-util');
exports.type = require('utils-type');
exports.color = require('chalk');
exports.vinylFS = require('vinyl-fs');
exports.inherits = require('util').inherits;

// assorted
//
exports.createREPL = function(gulp){
  var readline = require('readline');

  var repl = gulp.repl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: function completion(line){
      return exports.completer(gulp, line);
    }
  });

  repl.on('line', function(line){
    line = line.trim();
    if(!line){ repl.prompt(); }

    var notFound = [];
    line = line.split(/[ ]+/).filter(function(task){
      var found = gulp.tasks.get(task) || {};
      if(typeof found.handle === 'function'){ return true; }
      notFound.push(task);
    });

    if(notFound.length){
      var plural = notFound.length > 1;
      console.log(' Warning: `%s` task%s %s undefined',
        notFound.join(', '),
        plural && 's' || '',
        plural && 'are' || 'is'
      );

      if(!line.length){ return repl.promp(); }
    }

    gulp.stack.apply(gulp, line)();
  });

  repl.on('SIGINT', function(){
    repl.output.write('\n');
    console.log(new Date());
    process.exit(0);
  });
};

exports.completer = function completer(gulp, line){
  var key, task, hits, match;

  var tasks = gulp.tasks.store;
  var completion = [];

  for(key in tasks){
    if(!tasks.hasOwnProperty(task)){ continue; }
    task = tasks[key];
    match = (task.regex.match(line) || []).pop();
    if(match){ completion.push(task.stem || task.path); }
  }

  match = line.match(/([ ]+|^)\S+$/);
  if(match){
    line = line.slice(match.index, line.length).trim();
  }

  hits = completion.filter(function(elem){
    return !elem.indexOf(line);
  });

  return [hits.length ? hits : completion, line];
};
