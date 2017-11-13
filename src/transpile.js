const {
  UNARY,
  BINARY,
  LITERAL,
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

const binaryOps = {
  [PLUS]: (left, right) => {
    if (
      (typeof left === 'number' || typeof left === 'string') && 
      (typeof right === 'number' || typeof right === 'string')
    ) {
      return `${left} + ${right}`
    } else {
      throw "Syntax error."
    }
  },
  [MINUS]: (left, right) => {
    if (typeof left === 'number' && typeof right === 'number') {
      return `${left} - ${right}`
    } else {
      throw "Syntax error."
    }
  },
  [STAR]: (left, right) => {
    if (typeof left === 'number' && typeof right === 'number') {
      return `${left} * ${right}`
    } else if (typeof left === 'number' && typeof right === 'string') {
      return `${right}.repeat(${left})`
    } else if (typeof left === 'string' && typeof right === 'number') {
      return `${left}.repeat(${right})`
    } else {
      throw "Syntax error."
    }
  },
  [SLASH]: (left, right) => {
    if (typeof left === 'number' && typeof right === 'number') {
      return `${left} / ${right}`
    } else {
      throw "Syntax error."
    }
  },
  [STAR_STAR]: (left, right) => {
    if (typeof left === 'number' && typeof right === 'number') {
      return Math.pow(left, right)
    } else {
      throw "Syntax error."
    }
  },
  [STAR_STAR]: (left, right) => {
    if (typeof left === 'number' && typeof right === 'number') {
      return `Math.pow(${left}, ${right})`
    } else {
      throw "Syntax error."
    }
  },
  [AND]: (left, right) => {
    if (typeof left === 'boolean' && typeof right === 'boolean') {
      return `${left} && ${right}`
    } else {
      throw "Syntax error."
    }
  },
  [OR]: (left, right) => {
    if (typeof left === 'boolean' && typeof right === 'boolean') {
      return `${left} || ${right}`
    } else {
      throw "Syntax error."
    }
  },
  [EQUAL_EQUAL]: (left, right) => {
    return `${left} === ${right}`
  },
  [BANG_EQUAL]: (left, right) => {
    return `${left} !== ${right}`
  },
  [LESS]: (left, right) => {
    if (typeof left === 'number' && typeof right === 'number') {
      return `${left} < ${right}`
    } else {
      throw "Syntax error."
    }
  },
  [GREATER]: (left, right) => {
    if (typeof left === 'number' && typeof right === 'number') {
      return `${left} > ${right}`
    } else {
      throw "Syntax error."
    }
  },
  [LESS_EQUAL]: (left, right) => {
    if (typeof left === 'number' && typeof right === 'number') {
      return `${left} <= ${right}`
    } else {
      throw "Syntax error."
    }
  },
  [GREATER_EQUAL]: (left, right) => {
    if (typeof left === 'number' && typeof right === 'number') {
      return `${left} >= ${right}`
    } else {
      throw "Syntax error."
    }
  },
  [EQUAL]: (left, right, state) => {
    if (left.literal in state) {
      throw `"${left.literal} is already defined."`
    } else {
      state[left.literal] = right
      return `const ${left.literal} = ${right}`
    }
  }
}

const unaryOps = {
  [NOT]: value => {
    if (typeof value === 'boolean' || typeof value === 'number') {
      return `!${value}`
    } else {
      throw "Syntax error."
    }
  },
  [MINUS]: value => {
    if (typeof value === 'number') {
      return `-${value}`
    } else {
      throw "Syntax error."
    }
  }
}

const expressionVisitors = {
  [BINARY]: (node, state) => {
    try {
      const left = expressionVisitors[node.left.type](node.left)
      const right = expressionVisitors[node.right.type](node.right)

      if (node.value.type in binaryOps) {
        return binaryOps[node.value.type](left, right, state)
      } else {
        throw `Invalid operation.`
      }
    } catch(e) {
      throw `Syntax error at line ${node.value.line}: ${e}.`
    }
  },
  [UNARY]: node => {
    try {
      const right = expressionVisitors[node.right.type](node.right)
      if (node.value.type in unaryOps) {
        return unaryOps[node.value.type](right)
      } else {
        throw `Syntax error at line ${node.value.line}.`
      }
    } catch(e) {
      throw `Syntax error at line ${node.value.line}.`
    }
    
  },
  [LITERAL]: node => node.value,
  [GROUP]: node => node.value.value
}

const statementVisitors = {
  [PRINT_STMT]: statement => {
    return `console.log(${expressionVisitors[statement.value.type](statement.value)});`
  },
  [EXPR_STMT]: (statement, state) => {
    return `${expressionVisitors[statement.value.type](statement.value, state)};`
  }
}

const interpret = statements => {
  const state = {}

  try {
    return statements.reduce((acc, statement) => `${acc}
${statementVisitors[statement.type](statement, state)}`, "")
  } catch(e) {
    console.log(e)
    return ""
  }
}

module.exports = interpret