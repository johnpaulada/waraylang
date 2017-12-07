const tokenize  = require('./tokenize')
const parse     = require('./parse')
const interpret = require('./interpret')
// const transpile = require('./transpile')

const MODE_INTERPRET = Symbol.for('interpret'),
      MODE_TRANSPILE = Symbol.for('transpile')

const LANG_WARAY   = Symbol.for('waray'),
      LANG_TAGALOG = Symbol.for('tagalog')

const run = program => interpret(MODE_INTERPRET, LANG_WARAY)(parse(tokenize(program)))

run(`

`)