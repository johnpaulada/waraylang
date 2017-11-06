const {
  EOF,
  NUMBER,
  STAR,
  STAR_STAR,
  SLASH,
  PLUS,
  MINUS,
  GREATER_EQUAL,
  LESS_EQUAL,
  GREATER,
  LESS
} = require('./TokenTypes')

const {
  createBinary,
  createLiteral
} = require('./ExpressionCreators')

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
    if (match(NUMBER)) return createLiteral(previous().literal)
  }

  const exponentiation = () => {
    let expr = primary()

    while (match(STAR_STAR)) {
      const operator = previous()
      const right = primary()

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
  
  const expression = comparison

  return expression()
}

module.exports = parse