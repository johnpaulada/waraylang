const tokenize = require('./tokenize')
const parse = require('./parse')
const interpret = require('./interpret')

console.log(interpret(parse(tokenize('"3" * 2'))));