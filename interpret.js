const {
  UNARY,
  BINARY,
  LITERAL,
  GROUP
} = require('./ExpressionTypes')

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
      return left + right
    } else {
      throw "Syntax error."
    }
  },
  [MINUS]: (left, right) => {
    if (typeof left === 'number' && typeof right === 'number') {
      return left - right
    } else {
      throw "Syntax error."
    }
  },
  [STAR]: (left, right) => {
    if (typeof left === 'number' && typeof right === 'number') {
      return left * right
    } else if (typeof left === 'number' && typeof right === 'string') {
      return right.repeat(left)
    } else if (typeof left === 'string' && typeof right === 'number') {
      return left.repeat(right)
    } else {
      throw "Syntax error."
    }
  },
  [SLASH]: (left, right) => {
    if (typeof left === 'number' && typeof right === 'number') {
      return left / right
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
  [AND]: (left, right) => {
    if (typeof left === 'boolean' && typeof right === 'boolean') {
      return left && right
    } else {
      throw "Syntax error."
    }
  },
  [OR]: (left, right) => {
    if (typeof left === 'boolean' && typeof right === 'boolean') {
      return left || right
    } else {
      throw "Syntax error."
    }
  },
  [EQUAL_EQUAL]: (left, right) => {
    return left === right
  },
  [BANG_EQUAL]: (left, right) => {
    return left !== right
  },
  [LESS]: (left, right) => {
    if (typeof left === 'number' && typeof right === 'number') {
      return left < right
    } else {
      throw "Syntax error."
    }
  },
  [GREATER]: (left, right) => {
    if (typeof left === 'number' && typeof right === 'number') {
      return left > right
    } else {
      throw "Syntax error."
    }
  },
  [LESS]: (left, right) => {
    if (typeof left === 'number' && typeof right === 'number') {
      return left <= right
    } else {
      throw "Syntax error."
    }
  },
  [GREATER_EQUAL]: (left, right) => {
    if (typeof left === 'number' && typeof right === 'number') {
      return left >= right
    } else {
      throw "Syntax error."
    }
  }
}

const unaryOps = {
  [NOT]: value => {
    if (typeof value === 'boolean' || typeof value === 'number') {
      return !value
    } else {
      throw "Syntax error."
    }
  },
  [MINUS]: value => {
    if (typeof value === 'number') {
      return -value
    } else {
      throw "Syntax error."
    }
  }
}

const visitors = {
  [BINARY]: node => {
    try {
      const left = visitors[node.left.type](node.left)
      const right = visitors[node.right.type](node.right)
      if (node.value.type in binaryOps) {
        return binaryOps[node.value.type](left, right)
      } else {
        throw `Syntax error at line ${node.value.line}.`
      }
    } catch(e) {
      throw `Syntax error at line ${node.value.line}.`
    }
  },
  [UNARY]: node => {
    try {
      const right = visitors[node.right.type](node.right)
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

const interpret = node => {
  try {
    return visitors[node.type](node)
  } catch(e) {
    return e
  }
}

module.exports = interpret