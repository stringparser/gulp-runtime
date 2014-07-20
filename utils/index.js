'use strict';

// helpers
var stdin = process.stdin
  , stdout = process.stdout
  , stderr = process.stderr;

export.promptText = promptText = ' > gulp '

exports.prompt = function prompt(e, fn){

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

// flush on exit
// taken from https://gist.github.com/3427357
exports.flushExit = function flushExit(exitCode) {
  if (stdout._pendingWriteReqs || stderr._pendingWriteReqs) {
    process.nextTick(function() {
      exit(exitCode);
    });
  } else {
    process.exit(exitCode);
  }
}