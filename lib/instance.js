
//
// Attach commnad line to running instance
//

module.exports = function gulpInstance(gulp){

  //
  // propmt from the global gulp
  gulp.once('task_start', function(){
      prompt('task_stop', gulp);
      instance(gulp);
    }).on('task_err', function(){
      prompt('task_err', gulp)
    }).on('task_not_found', function(){
      prompt('task_not_found', gulp);
    }).on('err', function(){
      prompt('err', gulp);
    })

  return gulp;
}