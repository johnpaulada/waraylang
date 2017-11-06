const tokenize = require('./tokenize')
const parse = require('./parse')

console.log(parse(tokenize('2 + 2 == 2')));