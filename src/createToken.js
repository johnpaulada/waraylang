const createToken = (type, lexeme, literal, line) => ({
  type, lexeme, literal, line,
  toString: () => `${lexeme} ${literal}`
})

module.exports = createToken