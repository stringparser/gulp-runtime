
var stdout = process.stdout;

// default prompt text
exports.promptText = promptText = ' > gulp ';
// prompter
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