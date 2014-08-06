/*
supported colours
- bold
- italic
- underline
- inverse
- yellow
- cyan
- white
- magenta
- green
- red
- grey
- blue
*/

var defs = {
  string1 : 'red',
  string2 : 'red',
  punct   : ['white', 'bold'],
  curly   : 'green',
  parens  : ['blue', 'bold'],
  square  : ['yellow'],
  name    : 'white',
  keyword : ['cyan'],
  number  : 'magenta',
  regexp  : 'magenta',
  comment1: 'grey',
  comment2: 'grey'
}

var tokenize = require('js-tokenizer')

//this monkeypatches colors on to strings :(
               require('colors')

var highlight = module.exports = function (text, col) {
  col = col || {}

  for(var k in col)
    if(/\./.test(col[k]))
      col[k] = col[k].split('.')

  function highlight (str, col) {
    if(!col) return str
    if(Array.isArray(col))
      col.forEach(function (col) {
        str = str[col]
      })
    else
      str = str[col]
    return str
  }

  return tokenize(text, true).map(function (str) {
    var type = tokenize.type(str)
    var colour = col[type] || defs[type]
      return highlight(str, colour)
  }).join('')
}

if(!module.parent) {
  console.log(
    highlight(require('fs').readFileSync(process.argv[2], 'utf8'))
  )
}

