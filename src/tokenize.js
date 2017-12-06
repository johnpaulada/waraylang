const TokenTypes = require('./TokenTypes')
const createToken = require('./createToken')
const reservedWords = require('./reserved')

const {
  LEFT_PAREN, 
  RIGHT_PAREN,
  LEFT_SQUARE, 
  RIGHT_SQUARE,
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
  PIPE,
  MAP,
  REDUCE,
  FILTER,
  CARET
} = TokenTypes

const tokenize = source => {
    const sourceLength = source.length
    const tokens = []
    let start = 0, current = 0, line = 1

    const isAtEnd = () => current >= sourceLength
    const advance = () => source.charAt(current++)
    const peek = () => isAtEnd() ? '\0' : source.charAt(current)
    const peekNext = () => current + 1 >= source.length() ? '\0' : source.charAt(current + 1)
    const isDigit = c => c >= '0' && c <= '9'
    const isAlpha = c => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_'
    const isAlphaNumeric = c => isAlpha(c) || isDigit(c);

    const match = expected => {
      if (isAtEnd()) return false;
      if (source.charAt(current) != expected) return false;
      current++;

      return true;
    }

    const addToken = (type, literal = null) => {
        const text = source.substring(start, current)
        tokens.push(createToken(type, text, literal, line))
    }

    const string = () => {
      while (peek() != '"' && !isAtEnd()) {
        if (peek() == '\n') line++;
        advance();
      }
  
      // Unterminated string.
      if (isAtEnd()) {
        console.log(line, "Unterminated string.");
        return;
      }
  
      // The closing ".
      advance();
  
      // Trim the surrounding quotes.
      const value = source.substring(start + 1, current - 1);
      addToken(STRING, value);
    }

    const number = () => {
      while (isDigit(peek())) advance();
  
      // Look for a fractional part.
      if (peek() == '.' && isDigit(peekNext())) {
        // Consume the "."
        advance();
  
        while (isDigit(peek())) advance();
      }
  
      addToken(NUMBER, parseFloat(source.substring(start, current)));
    }

    const identifier = () => {
      while (isAlphaNumeric(peek())) advance();
      const text = source.substring(start, current);
      addToken(text in reservedWords ? reservedWords[text] : IDENTIFIER, text);
    }

    const doEqual = () => {
      const nextToEqual = peek()
      match(nextToEqual)

      return nextToEqual === '=' ? GREATER_EQUAL : nextToEqual === '>' ? MAP : EQUAL
    }

    const doGreater = () => {
      const nextToEqual = peek()
      match(nextToEqual)

      return nextToEqual === '=' ? EQUAL_EQUAL : nextToEqual === '>' ? REDUCE : GREATER
    }

    const scanToken = () => {
        const c = advance()

        switch (c) {
            case '(': addToken(LEFT_PAREN); break;
            case ')': addToken(RIGHT_PAREN); break;
            case '[': addToken(LEFT_SQUARE); break;
            case ']': addToken(RIGHT_SQUARE); break;
            case '{': addToken(LEFT_BRACE); break;
            case '}': addToken(RIGHT_BRACE); break;
            case ',': addToken(COMMA); break;
            case '.': addToken(DOT); break;
            case '-': addToken(match('>') ? FILTER : MINUS); break;
            case '+': addToken(PLUS); break;
            case ':': addToken(COLON); break;
            case ';': addToken(SEMICOLON); break;
            case '^': addToken(CARET); break;
            case '*': addToken(match('*') ? STAR_STAR : STAR); break;
            case '!': addToken(match('=') ? BANG_EQUAL : BANG); break;
            case '=': addToken(doEqual()); break;
            case '<': addToken(match('=') ? LESS_EQUAL : LESS); break;
            case '>': addToken(doGreater()); break;
            case '|': if (match('>')) addToken(PIPE); break;
            case '#': while (peek() != '\n' && !isAtEnd()) advance(); break;
            case ' ': case '\r': case '\t': break;
            case '\n': line++; break;
            case '"': string(); break;
            default:
              if (isDigit(c)) number();
              else if (isAlpha(c)) identifier();
              else console.log("Dafuq is this doing here:", c);
              break;
        }
    }

    while (!isAtEnd()) {
        start = current
        scanToken()
    }

    addToken(EOF)

    return tokens
}

module.exports = tokenize