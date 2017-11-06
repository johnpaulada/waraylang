const createToken = (type, lexeme, literal, line) => ({
  type, lexeme, literal, line,
  toString: () => `${type} ${lexeme} ${literal}`
})

module.exports = createToken