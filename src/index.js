const tokenize = require('./tokenize')
const parse = require('./parse')
const interpret = require('./interpret')
// const transpile = require('./transpile')

const MODE_INTERPRET = Symbol.for('interpret'),
      MODE_TRANSPILE = Symbol.for('transpile')

const LANG_WARAY   = Symbol.for('waray'),
      LANG_TAGALOG = Symbol.for('tagalog')

const run = program => interpret(MODE_INTERPRET, LANG_WARAY)(parse(tokenize(program)))
// const run = program => console.log(JSON.stringify(parse(tokenize(program))))
// const run = program => console.log(JSON.stringify(tokenize(program)))
// const jsify = program => transpile(parse(tokenize(program)))

run(`
himo square(x):
  balik x ^ 2 tapos
tapos
himo sum(total, x):
  balik total + x tapos
tapos
yakan [1, 2, 3] => square tapos
yakan [1, 2, 3] >> sum tapos 
`)