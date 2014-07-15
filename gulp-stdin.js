'use strict';

// module dependencies
var gulp = require('gulp');
var gutil = require('gulp-util');
var spawn = require('child_process').spawn;

// helpers
var input = process.stdin;
var output = process.stdout;
var error = process.stderr;

// go to `old` stream mode
input.resume();

input.setEncoding('utf8');

input.on('data', function(data){

  // preference to gulp cli
  if(data[0] === '-'){
    data = data.trim()
               .replace(/[ ]+/g,' ')
               .split(' ');

    spawn('gulp', data, {
      stdio : 'inherit'
    });
  }
  else
    gutil.log(data);
});

