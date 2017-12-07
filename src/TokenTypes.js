const TokenTypes = {

  // Single-character tokens
  LEFT_PAREN: Symbol.for("("), RIGHT_PAREN: Symbol.for(")"),
  LEFT_BRACE: Symbol.for("{"), RIGHT_BRACE: Symbol.for("}"),
  LEFT_SQUARE: Symbol.for("["), RIGHT_SQUARE: Symbol.for("]"),
  COMMA: Symbol.for(","), DOT: Symbol.for("."),
  MINUS: Symbol.for("-"), PLUS: Symbol.for("+"),
  SLASH: Symbol.for("/"), POUND: Symbol.for("#"),
  NOT: Symbol.for("not"), COLON: Symbol.for(":"),

  // One or two character tokens
  BANG: Symbol.for("!"), BANG_EQUAL: Symbol.for("!="),
  EQUAL: Symbol.for("="), EQUAL_EQUAL: Symbol.for("=="),
  GREATER: Symbol.for(">"), GREATER_EQUAL: Symbol.for(">="),
  LESS: Symbol.for("<"), LESS_EQUAL: Symbol.for("<="),
  STAR: Symbol.for("*"), STAR_STAR: Symbol.for("**"),
  CARET: Symbol.for("^"), PIPE: Symbol.for("|>"),
  MAP: Symbol.for("=>"), REDUCE: Symbol.for(">>"),
  FILTER: Symbol.for("->"), MODULO: Symbol.for("%"),

  // Literals
  IDENTIFIER: Symbol.for("identifier"), STRING: Symbol.for("string"), NUMBER: Symbol.for("number"),

  // Keywords
  END: Symbol.for("tapos"),
  AND: Symbol.for("and"),
  ELSE: Symbol.for("else"),
  FALSE : Symbol.for("false"),
  FUN: Symbol.for("fun"),
  FOR: Symbol.for("for"),
  IF: Symbol.for("if"),
  NIL: Symbol.for("nil"),
  NOT: Symbol.for("not"),
  OR: Symbol.for("or"),
  PRINT: Symbol.for("print"),
  RETURN: Symbol.for("return"),
  TRUE: Symbol.for("true"),
  VAR: Symbol.for("var"),
  WHILE: Symbol.for("while"),
  EOF: Symbol.for("EOF")
}

module.exports = TokenTypes