const {
  BINARY,
  LITERAL
} = require('./ExpressionTypes')

const createBinary = (left, operator, right) => {
  return {
    type: BINARY,
    value: operator,
    left, right
  }
}

const createLiteral = value => {
  return {
    type: LITERAL,
    value
  }
}

module.exports = {
  createBinary,
  createLiteral
}