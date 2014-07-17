'use strict';

// Module dependencies
var gulp = require('gulp');
var gutil = require('gulp-util');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var through = require('through2');
var runtime = require('sculpt');

// helpers
var child;
var handles = {
  attach : function(/* args */){

    var args = Array.prototype.slice.call(arguments);
    args.forEach(function(std){
      stdioEvents.forEach(function(e){
        std.on(e, function(){
          console.log(e)
          console.log(arguments)
        })
      })
    })
  }
};
var promptText = ' > gulp ';
var stdin = process.stdin;
var stdout = process.stdout;
var stderr = process.stderr;
var tasks = gulp.tasks;
var stdioEvents = [
  'end', 'exit', 'finish', 'close'
];

stdin.resume();
stdin.setEncoding('utf8');

stdin.pipe(
  runtime.map(manager)
).pipe(stdout);

function manager(chunk){



  var wait = false;
  var argv = chunk.trim()
                  .replace(/[ ]+/g, ' ')
                  .split(' ');

  if(argv[0][0] === '-')
    wait = true;
  else if(tasks[argv[0]])
    wait = true;
  else
    wait = false;

  if(wait){

    // by default, preserve colors
    if(argv[0] !== '--color' || argv[0] !== '--no-color')
      argv.unshift('--color');

    var c = 0;
    child = spawn('gulp', argv);
    child.unref();

    var all = [];
    var plumber = through({ encoding : 'utf8'}, function(chunk, enc, cb){
      this.push(chunk);
      cb();
    }).on('data', function(data){
      stdout.write(data)
    }).on('end', function(){
      console.log('ended!')
    })

    child.stdout.on('data', function(buf) {
      console.log('[STR] stdout "%s"', String(buf));
      stdout += buf;
    });
    child.stderr.on('data', function(buf) {
      console.log('[STR] stderr "%s"', String(buf));
      stderr += buf;
    });
    child.on('close', function(code) {
      console.log('[END] code', code);
      console.log('[END] stdout "%s"', stdout);
      console.log('[END] stderr "%s"', stderr);
    });

    return '';

  }
  else
    return chunk;
}

function prompt(e, fn){

  if(typeof e === 'string' && fn && fn.on)
    fn.once(e, function(){
      console.log('event : '+e);
      stdout.write(promptText);
    });
  else {
    console.log('else prompts', arguments)
    stdout.write(promptText);
  }
}


//
// propmt from the global gulp
gulp.on('task_start', function(){
    prompt('task_stop', gulp);
  }).on('task_err', function(){
    prompt('task_err', gulp)
  }).on('task_not_found', function(){
    prompt('task_not_found', gulp);
  })


// Flush
// https://gist.github.com/3427357
function flushExit(exitCode) {
  if (process.stdout._pendingWriteReqs || process.stderr._pendingWriteReqs) {
    process.nextTick(function() {
      exit(exitCode);
    });
  } else {
    process.exit(exitCode);
  }
}

module.exports = gulp;