const TokenTypes = require('./TokenTypes')

const {
  AND,
  ELSE,
  FALSE,
  FUN,
  FOR,
  IF,
  NIL,
  NOT,
  OR,
  PRINT,
  RETURN,
  TRUE,
  VAR,
  WHILE,
  END
} = TokenTypes

module.exports = {
  'ngan': AND,
  'kundire': ELSE,
  'buwa': FALSE,
  'fun': FUN,
  'for': FOR,
  'kun': IF,
  'waray': NIL,
  'dire': NOT,
  'o': OR,
  'yakan': PRINT,
  'balik': RETURN,
  'tuod': TRUE,
  'var': VAR,
  'while': WHILE,
  'tapos': END
}