const tokenize = require('./tokenize')
const parse = require('./parse')
const interpret = require('./interpret')
const run = program => interpret(parse(tokenize(program)))

run(`1 + 1 tapos
    yakan "ambot" tapos`)