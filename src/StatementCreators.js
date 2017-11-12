const {
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

module.exports = {
  createPrint,
  createExpr
}