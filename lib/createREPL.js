'use strict';

exports = module.exports = createREPL;

function createREPL(gulp){
  if(gulp.repl && gulp.repl !== true){ return; }

  var readline = require('readline');

  var repl = gulp.repl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: function completion(line){
      return completer(gulp, line);
    }
  });

  repl.on('line', function(line){
    line = line.trim();
    if(!line){ return repl.prompt(); }

    var notFound = [];
    line = line.split(/[ ]+/).filter(function(task){
      var found = gulp.tasks.get(task) || {};
      if(typeof found.fn === 'function'){ return true; }
      notFound.push(task);
    });

    if(notFound.length){
      var plural = notFound.length > 1;
      console.log(' `%s` task%s %s is not defined yet',
        notFound.join(', '),
        plural && 's' || '',
        plural && 'are' || 'is'
      );

      if(!line.length){ return repl.prompt(); }
    }

    gulp.stack.apply(gulp, line)();
  });

  repl.on('SIGINT', function(){
    repl.output.write('\n');
    console.log(new Date());
    process.exit(0);
  });
}

function completer(gulp, line){
  var match = line.match(/([ ]+|^)\S+$/);
  var completion = Object.keys(gulp.tasks.store);

  if(match){
    line = line.slice(match.index, line.length).trim();
  }

  var hits = completion.filter(function(elem){
    return !elem.indexOf(line);
  });

  return [hits.length ? hits : completion, line];
}
