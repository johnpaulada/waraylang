const {
  IF_STMT,
  PRINT_STMT,
  EXPR_STMT,
} = require('./StatementTypes')

const createPrint = value => {
  return {
    type: PRINT_STMT,
    value
  }
}

const createExpr = value => {
  return {
    type: EXPR_STMT,
    value
  }
}

const createIf = (condition, body, elseBody=null) => {
  return {
    type: IF_STMT,
    value: condition,
    left: body,
    right: elseBody
  }
}

module.exports = {
  createPrint,
  createExpr,
  createIf
}