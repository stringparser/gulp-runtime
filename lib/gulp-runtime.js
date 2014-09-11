
var minimist = require('minimist');

var runtime = module.exports = (
  new require('./../../..').create('gulp')
);

runtime({
       env : process.env,
     pargv : minimist(process.argv),
  INIT_CWD : process.cwd()
});

runtime.require('./gulp-cli');
runtime.require('./built-ins');

gulp.doneCallback = function(){

  setTimeout(function(){
    runtime.prompt();
  }, 200);
};
