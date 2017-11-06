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
  WHILE
} = TokenTypes

module.exports = {
  'ngan': AND,
  'else': ELSE,
  'buwa': FALSE,
  'fun': FUN,
  'for': FOR,
  'kun': IF,
  'nil': NIL,
  'dire': NOT,
  'o': OR,
  'print': PRINT,
  'balik': RETURN,
  'tuod': TRUE,
  'var': VAR,
  'while': WHILE
}