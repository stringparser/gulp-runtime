
### gulp-runtime [<img alt="progressed.io" src="http://progressed.io/bar/75" align="right"/>](https://github.com/fehmicansaglam/progressed.io)

 - [Your CLI/REPL](cli-repl.md) - every task, every command
 - [API](api.md) - write commands, communicate with the REPL using code
 - [Extras](extras.md) - some times: enough is not enough

Going back and forth between editor and terminal is not that fun when you are trying things out for the first time. That's what happened when I met [gulp][x-gulp] and for some reason it had to stop.

The idea of the project is to use gulp at runtime and in order to do that a solution could be to make a REPL. But if we want to use the API its "language" has to be available to the REPL so those "commands" can be run.

*That's too much for a plugin* indeed and could be used elsewhere, so it was split to the [runtime][x-runtime] module. What we'll do here is to implement the [gulp CLI][x-gulp-cli] "commands" that will serve the REPL.

Now, of course and [WTF][x-wtf], if **all you want is a REPL for your gulp tasks** just do the following and you are done.

```js
// A REPL with the gulp CLI and all your tasks
require('gulp-runtime');
```

1. <kbd>enter</kbd> to see the prompt.
1. <kbd>tab</kbd> to see completion.
1. write the tasks you want to run.

If you want more juice keep on reading.

<p align="center">
  <img height="300" src="./gulp-runtime.png"/>
</p>

<!---------------
 Links and stuff
----------------->


[x-gulp]: https://github.com/gulpjs/gulp
[x-gulp-cli]: https://github.com/gulpjs/gulp/blob/master/docs/CLI.md

[x-runtime]: https://github.com/stringparser/runtime
[x-wtf]: https://www.google.es/search?q=wtf&safe=off&espv=2&qscrl=1&biw=1745&bih=861&tbm=isch&tbo=u&source=univ&sa=X&ei=TQNdVLzdPPjIsAStyIDABw&ved=0CDEQsAQ
