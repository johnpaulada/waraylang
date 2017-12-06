const {
  IF_STMT,
  PRINT_STMT,
  EXPR_STMT,
  FN_STMT,
  RETURN_STMT
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

const createReturn = value => {
  return {
    type: RETURN_STMT,
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

createFn = (name, params, body) => {
  return {
    type: FN_STMT,
    value: name,
    params,
    body
  }
}

module.exports = {
  createPrint,
  createExpr,
  createIf,
  createFn,
  createReturn
}