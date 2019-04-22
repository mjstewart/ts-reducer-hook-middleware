# ts-reducer-hook-middleware

typescript react useReducer hook with redux middleware.

# Why?

typescript conditional types make it easy to ensure the reducer and composed middleware are typesafe.

# Install
https://www.npmjs.com/package/ts-reducer-hook-middleware
`npm i ts-reducer-hook-middleware`

# Examples

```
  const upperConsoleLogger: Middleware<TodoState, TodoAction> = api => next => action => {
  console.log(`upperConsoleLogger - NEXT ACTION = ${JSON.stringify(action)}`);
  next(action);
  };

  ...

  const { store, dispatch } = useReducerWithMiddleware<typeof todoReducer>(todoReducer, initialState)([
    lowerConsoleLogger,
    upperConsoleLogger,
    historyLogger,
  ]);

```

The example project contains the full version

https://github.com/mjstewart/ts-reducer-hook-middleware/blob/master/example/src/todo/index.tsx#L43
