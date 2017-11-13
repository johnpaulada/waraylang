const {
  EOF,
  NIL,
  TRUE,
  FALSE,
  NUMBER,
  STAR,
  STAR_STAR,
  CARET,
  SLASH,
  PLUS,
  MINUS,
  GREATER_EQUAL,
  LESS_EQUAL,
  GREATER,
  LESS,
  AND,
  NOT,
  OR,
  EQUAL_EQUAL,
  BANG_EQUAL,
  EQUAL,
  STRING,
  LEFT_PAREN,
  RIGHT_PAREN,
  END,
  PRINT,
  IDENTIFIER
} = require('./TokenTypes')

const {
  createUnary,
  createBinary,
  createLiteral,
  createVariable,
  createGroup
} = require('./ExpressionCreators')

const {
  createPrint,
  createExpr
} = require('./StatementCreators')

const parse = tokens => {
  let start   = 0,
      current = 0

  const peek     = () => tokens[current],
        previous = () => tokens[current - 1],
        eat      = () => tokens[current++],
        isAtEnd  = () => peek().type == EOF,
        check    = type => isAtEnd() ? false : peek().type == type

  const match = (...typesToMatch) => {
    if (typesToMatch.some(check)) {
      eat()
      return true
    } else {
      return false
    }
  }

  const primary = () => {
    if (match(IDENTIFIER)) return createVariable(previous())
    if (match(TRUE)) return createLiteral(true)
    if (match(FALSE)) return createLiteral(false)
    if (match(NIL)) return createLiteral(null)
    if (match(NUMBER, STRING)) return createLiteral(previous().literal)

    if (match(LEFT_PAREN)) {
      const expr = expression();
      if (match(RIGHT_PAREN)) {
        return createGroup(expr)
      } else {
        throw new Error('May kulang nga ")".')
      }
    }
  }

  const unary = () => {
    let expr = null

    if (match(MINUS, NOT)) {
      const operator = previous()
      const right = primary()
      expr = createUnary(operator, right)
    } else {
      expr = primary()
    }

    return expr
  }

  const exponentiation = () => {
    let expr = unary()

    while (match(CARET)) {
      const operator = previous()
      const right = unary()

      expr = createBinary(expr, operator, right)
    }

    return expr
  }

  const multiplication = () => {
    let expr = exponentiation()

    while (match(STAR, SLASH)) {
      const operator = previous()
      const right = exponentiation()

      expr = createBinary(expr, operator, right)
    }

    return expr
  }

  const addition = () => {
    let expr = multiplication()

    while (match(PLUS, MINUS)) {
      const operator = previous()
      const right = multiplication()

      expr = createBinary(expr, operator, right)
    }

    return expr
  }

  const comparison = () => {
    let expr = addition()

    while (match(GREATER, GREATER_EQUAL, LESS, LESS_EQUAL)) {
      const operator = previous()
      const right = addition()

      expr = createBinary(expr, operator, right)
    }

    return expr
  }

  const equality = () => {
    let expr = comparison()

    while (match(EQUAL_EQUAL, BANG_EQUAL)) {
      const operator = previous()
      const right = comparison()

      expr = createBinary(expr, operator, right)
    }

    return expr
  }

  const boolean = () => {
    let expr = equality()

    while (match(AND, OR)) {
      const operator = previous()
      const right = equality()

      expr = createBinary(expr, operator, right)
    }

    return expr
  }

  const assignment = () => {
    let expr = boolean()

    while (match(EQUAL)) {
      const operator = previous()
      const right = boolean()

      expr = createBinary(expr, operator, right)
    }

    return expr
  }
  
  const expression = assignment

  const printStatement = () => {
    const expr = expression()

    if (match(END)) {
      return createPrint(expr)
    } else {
      throw new Error('May kulang nga "tapos".')
    }
  }

  const expressionStatement = () => {
    const expr = expression()

    if (match(END)) {
      return createExpr(expr)
    } else {
      throw new Error('May kulang nga "tapos".')
    }
  }

  const statement = () => {
    if (match(PRINT)) return printStatement()

    return expressionStatement()
  }

  const program = () => {
    const statements = []

    while(!isAtEnd()) {
      statements.push(statement())
    }

    return statements
  }

  return program()
}

module.exports = parse