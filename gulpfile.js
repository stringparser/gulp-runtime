var gulp = require('gulp');
var runtime = require('./lib/gulp-runtime');

console.log(process.execArgv);
console.log(process.argv);
console.log(runtime.config('env'));

gulp.task('develop', function () {

});

gulp.task('lint', function(){

});

gulp.task('another', function(){

});

gulp.task('anotherOne', function(){

});

gulp.task('anotherMore', function(){

});

gulp.task('andAnotherOneMore', function(){

});

// build everything and open main entry page
gulp.task('default', ['develop', 'lint', 'another', 'anotherOne', 'anotherMore', 'andAnotherOneMore'], function () {
    // ...
});
