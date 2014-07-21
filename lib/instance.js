// module dependencies
var promptText = require('../utils').promptText;

// helpers
var stdout = process.stdout;

module.exports = function gulpInstance(gulp){

  init(gulp);

  return gulp;
}

// init logic
function init(gulp){

  gulp.once('task_start',function(){

    process.nextTick(function(){
      stdout.write(promptText);
    })
  })

}