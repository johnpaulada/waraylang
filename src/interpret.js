const {
  UNARY,
  BINARY,
  LITERAL,
  VARIABLE,
  GROUP
} = require('./ExpressionTypes')

const {
  PRINT_STMT,
  EXPR_STMT
} = require('./StatementTypes')

const {
  LEFT_PAREN, 
  RIGHT_PAREN,
  LEFT_BRACE,
  RIGHT_BRACE,
  COMMA,
  DOT,
  MINUS,
  PLUS,
  SEMICOLON,
  POUND,
  STAR,
  STAR_STAR,
  CARET,
  EQUAL,
  BANG,
  LESS,
  GREATER,
  BANG_EQUAL,
  EQUAL_EQUAL,
  LESS_EQUAL,
  GREATER_EQUAL,
  STRING,
  NUMBER,
  IDENTIFIER,
  NIL,
  EOF,
  COLON,
  END,
  NOT,
  SLASH,
  AND,
  OR
} = require('./TokenTypes')

const isIdentifier      = value => typeof value === 'object' && 'type' in value && value.type == IDENTIFIER
const getValue          = (state, value) => isIdentifier(value) ? state[value.literal] : value
const createTypeChecker = type => (value) => typeof value === type
const isNumber          = createTypeChecker('number')
const isString          = createTypeChecker('string')
const isBoolean         = createTypeChecker('boolean')
const eitherType        = (value, ...typeCheckers) => typeCheckers.some(typeChecker => typeChecker(value))
const ofType            = (typeChecker, ...values) => values.every(value => typeChecker(value))
const allPairs          = (pairs) => pairs.every(pair => pair[1](pair[0]))
const somePairs         = (pairs) => pairs.some(pair => pair[1](pair[0]))

const binaryOps = {
  [PLUS]: (left, right, state) => {
    if (eitherType(left, isNumber, isString) && eitherType(right, isNumber, isString)) {
      return left + right
    } else {
      throw "Sayop nga pag-dugang."
    }
  },
  [MINUS]: (left, right, state) => {
    if (ofType(isNumber, left, right)) {
      return left - right
    } else {
      throw "Dire pwede mag-iban dire numero."
    }
  },
  [STAR]: (left, right, state) => {
    if (ofType(isNumber, left, right)) {
      return left * right
    } else if (allPairs([[left, isNumber], [right, isString]])) {
      return right.repeat(left)
    } else if (allPairs([[left, isString], [right, isNumber]])) {
      return left.repeat(right)
    } else {
      throw "Sayop nga pag multiply."
    }
  },
  [SLASH]: (left, right, state) => {
    if (ofType(isNumber, left, right)) {
      return left / right
    } else {
      throw "Sayop nga pag divide."
    }
  },
  [STAR_STAR]: (left, right, state) => {
    if (ofType(isNumber, left, right)) {
      return Math.pow(left, right)
    } else {
      throw "Sayop nga pag exponent."
    }
  },
  [CARET]: (left, right, state) => {
    if (ofType(isNumber, left, right)) {
      return Math.pow(left, right)
    } else {
      throw "Sayop nga pag exponent."
    }
  },
  [AND]: (left, right) => {
    const v = createValueGetter(state)

    if (ofType(isBoolean, left, right)) {
      return left && right
    } else {
      throw "Syntax error."
    }
  },
  [OR]: (left, right) => {
    if (ofType(isBoolean, left, right)) {
      return left || right
    } else {
      throw "Sayop."
    }
  },
  [EQUAL_EQUAL]: (left, right) => {
    return left === right
  },
  [BANG_EQUAL]: (left, right) => {
    return left !== right
  },
  [LESS]: (left, right) => {
    if (ofType(isNumber, left, right)) {
      return left < right
    } else {
      throw "Sayop."
    }
  },
  [GREATER]: (left, right) => {
    if (ofType(isNumber, left, right)) {
      return left > right
    } else {
      throw "Sayop."
    }
  },
  [LESS_EQUAL]: (left, right) => {
    if (ofType(isNumber, left, right)) {
      return left <= right
    } else {
      throw "Sayop."
    }
  },
  [GREATER_EQUAL]: (left, right) => {
    if (ofType(isNumber, left, right)) {
      return left >= right
    } else {
      throw "Sayop."
    }
  },
  [EQUAL]: (left, right, state) => {
    if (left.literal in state) {
      throw `Mayda na "${left.literal}".`
    } else {
      state[left.literal] = right
    }
    
    return right
  }
}

const unaryOps = {
  [NOT]: value => {
    if (somePairs([[value, isBoolean], [value, isNumber]])) {
      return !value
    } else {
      throw "Sayop."
    }
  },
  [MINUS]: value => {
    if (isNumber(value)) {
      return -value
    } else {
      throw "Sayop."
    }
  }
}

const expressionVisitors = {
  [BINARY]: (node, state) => {
    try {
      const left = expressionVisitors[node.left.type](node.left, state)
      const right = expressionVisitors[node.right.type](node.right, state)
      const leftValue = getValue(state, left)
      const rightValue = getValue(state, right)

      if (isIdentifier(left) && node.value.type == EQUAL) {
        return binaryOps[node.value.type](left, right, state)
      }
      else if (node.value.type in binaryOps) {
        return binaryOps[node.value.type](leftValue, rightValue, state)
      } else {
        throw `Sayop nga operasyon.`
      }
    } catch(e) {
      throw `May sayop ka ha linya ${node.value.line}: ${e}.`
    }
  },
  [UNARY]: (node, state) => {
    try {
      const right = expressionVisitors[node.right.type](node.right)
      const rightValue = getValue(state, value)

      if (node.value.type in unaryOps) {
        return unaryOps[node.value.type](rightValue, state)
      } else {
        throw `May sayop ka ha linya ${node.value.line}.`
      }
    } catch(e) {
      throw `May sayop ka ha linya ${node.value.line}.`
    }
    
  },
  [VARIABLE]: node => node.value,
  [LITERAL]: node => node.value,
  [GROUP]: node => node.value.value
}

const statementVisitors = {
  [PRINT_STMT]: (statement, state) => {
    const result = expressionVisitors[statement.value.type](statement.value, state)
    const filteredResult = result === true ? "tuod" : result === false ? "buwa" : result

    return console.log(filteredResult)
  },
  [EXPR_STMT]: (statement, state) => {
    return expressionVisitors[statement.value.type](statement.value, state)
  }
}

const interpret = statements => {
  const state = {}

  try {
    for (statement of statements) {
      statementVisitors[statement.type](statement, state)
    }

    return 0
  } catch(e) {
    console.log(e)
    return -1
  }
}

module.exports = interpret