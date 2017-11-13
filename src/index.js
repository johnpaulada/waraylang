const tokenize = require('./tokenize')
const parse = require('./parse')
const interpret = require('./interpret')
const transpile = require('./transpile')
const run = program => interpret(parse(tokenize(program)))
const jsify = program => transpile(parse(tokenize(program)))

console.log(jsify(`tae = 2 tapos
yakan buwa tapos`))