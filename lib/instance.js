

module.exports = function gulpInstance(gulp){

  init(gulp);

  return gulp;
}

//
// initialize

var prompt = require('../utils').prompt;
function init(gulp){

/*  // the global gulp
  gulp.once('task_start', function(){
    prompt('task_stop', gulp);
  }).on('task_err', function(){
    prompt('task_err', gulp)
  }).on('task_not_found', function(){
    prompt('task_not_found', gulp);
  }).on('err', function(){
    prompt('err', gulp);
  })*/
}