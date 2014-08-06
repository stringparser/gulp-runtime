# ansi-highlight

highlight javascript in the terminal

# example

``` js
var highlight = require('ansi-highlight')
var js = require('fs').readFileSync(__filename, 'utf8')
console.log(highlight(js))
```

# see also

ansi-highlight uses regular expressions to tokenize javascript.
this is very fast and simple, but is incorrect is a few weird edgecases.
If need something to be completely correct, use [cardinal](https://github.com/thlorenz/cardinal)
which uses esprima to parse the javascript.

## License

MIT
