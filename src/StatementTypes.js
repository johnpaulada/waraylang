const PRINT_STMT  = Symbol.for('print_stmt'),
      EXPR_STMT   = Symbol.for('expr_stmt'),
      IF_STMT     = Symbol.for('if_stmt'),
      FN_STMT     = Symbol.for('fn_stmt'),
      RETURN_STMT = Symbol.for('return_stmt')

module.exports = {
    PRINT_STMT, EXPR_STMT, IF_STMT, FN_STMT, RETURN_STMT
}