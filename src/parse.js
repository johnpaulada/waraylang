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
  IDENTIFIER,
  COLON,
  IF,
  ELSE,
  FUN,
  COMMA,
  RETURN,
  PIPE,
  LEFT_SQUARE,
  RIGHT_SQUARE,
  MAP,
  REDUCE,
  FILTER
} = require('./TokenTypes')

const {
  createUnary,
  createBinary,
  createLiteral,
  createVariable,
  createGroup,
  createCall,
  createList
} = require('./ExpressionCreators')

const {
  createPrint,
  createExpr,
  createIf,
  createFn,
  createReturn
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

  const consume = (type, message) => {
    if (check(type)) return eat();

    throw `"${message}" sa may linya: ${peek().line}.`;
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

    if (match(LEFT_SQUARE)) {
      const contents = []
      if (!check(RIGHT_SQUARE)) {
        do {
          contents.push(expression())
        } while(match(COMMA))
      }
      consume(RIGHT_SQUARE, `May kulang nga "]"`)

      return createList(contents)
    }
  }

  const finishCall = (expr) => {
    const args = []
    if (!check(RIGHT_PAREN)) {
      do {
        args.push(expression());
      } while (match(COMMA));
    }

    if (match(RIGHT_PAREN)) {
      return createCall(expr, args);
    } else {
      throw new Error("Expect ')' after arguments.")
    }
  }

  const call = () => {
    let expr = primary();

    while (true) {
      if (match(LEFT_PAREN)) {
        expr = finishCall(expr);
      } else {
        break;
      }
    }

    return expr;
  }

  const unary = () => {
    let expr = null

    if (match(MINUS, NOT)) {
      const operator = previous()
      const right = primary()
      expr = createUnary(operator, right)
    } else {
      expr = call()
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

  const piping = () => {
    let expr = boolean()

    while (match(PIPE)) {
      const operator = previous()
      const right = boolean()

      expr = createBinary(expr, operator, right)
    }

    return expr
  }

  const reduce = () => {
    let expr = piping()

    while (match(REDUCE)) {
      const operator = previous()
      const right = piping()

      expr = createBinary(expr, operator, right)
    }

    return expr
  }

  const filter = () => {
    let expr = reduce()

    while (match(FILTER)) {
      const operator = previous()
      const right = reduce()

      expr = createBinary(expr, operator, right)
    }

    return expr
  }

  const map = () => {
    let expr = filter()

    while (match(MAP)) {
      const operator = previous()
      const right = filter()

      expr = createBinary(expr, operator, right)
    }

    return expr
  }

  const assignment = () => {
    let expr = map()

    while (match(EQUAL)) {
      const operator = previous()
      const right = map()

      expr = createBinary(expr, operator, right)
    }

    return expr
  }
  
  const expression = assignment

  const printStatement = () => {
    const expr = expression()
    consume(END, 'May kulang nga "tapos".')

    return createPrint(expr)
  }

  const returnStatement = () => {
    const expr = expression()
    consume(END, 'May kulang nga "tapos".')

    return createReturn(expr)
  }

  const expressionStatement = () => {
    const expr = expression()
    consume(END, 'May kulang nga "tapos".')

    return createExpr(expr)
  }

  const ifStatement = () => {
    const condition = expression()

    if (!match(COLON)) {
      throw new Error('May kulang nga ":".')
    }

    const body = bodyStatements(END)    

    if (match(ELSE)) {
      if (!match(COLON)) {
        throw new Error('May kulang nga ":".')
      }
      
      const elseBody = statement()
      
      if (!match(END)) {
        throw new Error('May kulang nga "tapos".') 
      }

      return createIf(condition, body, elseBody)
    }

    if (!match(END)) {
      throw new Error('May kulang nga "tapos".') 
    }

    return createIf(condition, body)
  }

  const statement = () => {
    if (match(PRINT)) return printStatement()
    if (match(RETURN)) return returnStatement()
    if (match(IF)) return ifStatement()

    return expressionStatement()
  }

  const bodyStatements = (ender) => {
    const statements = []

    while (!check(ender) && !isAtEnd()) {
      statements.push(declaration())
    }

    consume(ender, 'May kulang nga panapos')

    return statements
  }

  const functionDeclaration = () => {
    const functionName = consume(IDENTIFIER, 'Waray ngaran')
    consume(LEFT_PAREN, `Waray "(" kahuman han ngaran`)
    const params = []
    if (!check(RIGHT_PAREN)) {
      do {
        params.push(consume(IDENTIFIER, 'May kulang nga ngaran'))
      } while(match(COMMA))
    }
    consume(RIGHT_PAREN, `Waray ")" kahuman han mga ngaran`)
    consume(COLON, `May kulang nga ":"`)
    const body = bodyStatements(END)

    return createFn(functionName, params, body)
  }

  const declaration = () => {
    if (match(FUN)) return functionDeclaration()

    return statement();
  }

  const program = () => {
    const statements = []

    while(!isAtEnd()) {
      statements.push(declaration())
    }

    return statements
  }

  return program()
}

module.exports = parse