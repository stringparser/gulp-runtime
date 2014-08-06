

module.exports = function defaultCompleter(line){

  var argv = this.lexer(line);
  var completion = this.get(argv).completion;

  var hits = completion.filter(function(c){
    return c.indexOf(line) === 0;
  })

  return [ hits.length ? hits : completion, line];
}