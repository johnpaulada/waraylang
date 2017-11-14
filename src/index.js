const tokenize = require('./tokenize')
const parse = require('./parse')
const interpret = require('./interpret')
const transpile = require('./transpile')
const run = program => interpret(parse(tokenize(program)))
const jsify = program => transpile(parse(tokenize(program)))

run(`tae = "astig" tapos
yakan tae + " ka boss" tapos`)