
// helpers
var stdout = process.stdout
  , stderr = process.stderr;

// flush on exit
// taken from https://gist.github.com/3427357
module.exports = function flushExit(exitCode) {
  if (stdout._pendingWriteReqs || stderr._pendingWriteReqs) {
    process.nextTick(function() {
      exit(exitCode);
    });
  } else {
    process.exit(exitCode);
  }
}