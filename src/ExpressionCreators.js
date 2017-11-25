const {
  UNARY,
  BINARY,
  LITERAL,
  VARIABLE,
  GROUP,
  CALL
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

const createVariable = value => {
  return {
    type: VARIABLE,
    value
  }
}

const createCall = (value, args) => {
  return {
    type: CALL,
    value,
    args
  }
}

module.exports = {
  createUnary,
  createBinary,
  createLiteral,
  createVariable,
  createGroup
}