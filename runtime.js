'use strict';

// Module dependencies
var gulp = require('gulp');
var gutil = require('gulp-util')
var spawn = require('child_process').spawn;
var runtime = require('sculpt');

// expose `gulp`
module.exports = gulp;

// helpers
var promptText = ' > gulp ';
var stdin = process.stdin;
var stdout = process.stdout;
var stderr = process.stderr;
var task = gulp.tasks;

stdin.setEncoding('utf8');

stdin.pipe(
  runtime.filter(manager)
).pipe(stdout);

function manager(chunk){

  var argv = chunk.trim().replace(/[ ]+/g, ' ');
  var filter = true;

  if(argv[0] === '-')
    childGulp(argv);
  else if(task[argv[0]])
    chunk = JSON.stringify(task[argv[0]], null, '\t');
  else
    filter = false;

  return filter ? chunk : '';
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

function childGulp(argv){

  argv = argv.split(' ');

  // maintain default '--color'
  if(argv[0] !== '--color' && argv[0] !== '--no-color')
    argv.unshift('--color');

  stdout.write('\n')
  gutil.log('child gulp started', argv);
  var child = spawn('gulp', argv);

  child.stdin.end();

  // Handle output
  child.stdout.on('data', function(chunk){
    stdout.write(chunk)
  }).on('end', function(){
    stdout.write(promptText);
    child.kill();
  })
}

// flush on exit
// taken from https://gist.github.com/3427357
function flushExit(exitCode) {
  if (process.stdout._pendingWriteReqs || process.stderr._pendingWriteReqs) {
    process.nextTick(function() {
      exit(exitCode);
    });
  } else {
    process.exit(exitCode);
  }
}