'use strict';

var prompt = require('../utils').prompt;

module.exports = function(gulp){

  //
  // propmt from the global gulp
  gulp.on('task_start', function(){
      prompt('task_stop', gulp);
      console.log(gulp);
    }).on('task_err', function(){
      prompt('task_err', gulp)
    }).on('task_not_found', function(){
      prompt('task_not_found', gulp);
    }).on('err', function(){
      prompt('err', gulp);
    })

  return gulp;
}