const {
  UNARY,
  BINARY,
  LITERAL,
  GROUP
} = require('./ExpressionTypes')

const createUnary = (operator, right) => {
  return {
    type: UNARY,
    value: operator,
    right
  }
}

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

const createGroup = value => {
  return {
    type: GROUP,
    value
  }
}

module.exports = {
  createUnary,
  createBinary,
  createLiteral,
  createGroup
}