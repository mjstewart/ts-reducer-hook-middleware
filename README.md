# ts-reducer-hook-middleware

typescript react useReducer hook with redux middleware.

# Why?

typescript conditional types make it easy to ensure the reducer and composed middleware are typesafe.
The running example uses a Todo application where the reducer has a state and action type `Reducer<TodoState, TodoAction>` that each middleware must match `Middleware<TodoState, TodoAction>`.

# Install
https://www.npmjs.com/package/ts-reducer-hook-middleware

`npm i ts-reducer-hook-middleware`

# Examples

The example project contains the full version

https://github.com/mjstewart/ts-reducer-hook-middleware/tree/master/example

Contains the actual setup of the useReducer hook

https://github.com/mjstewart/ts-reducer-hook-middleware/blob/master/example/src/todo/index.tsx#L43


## Quick start example

```
  const upperConsoleLogger: Middleware<TodoState, TodoAction> = api => next => action => {
  console.log(`upperConsoleLogger - NEXT ACTION = ${JSON.stringify(action)}`);
  next(action);
  };

  const todoReducer: Reducer<TodoState, TodoAction> = (state, action) => {
  switch (action.type) {
    case ActionType.ADD: {
        ....
    }
  }

  // Must use typeof todoReducer for typescript to work its magic
  // middlewares applied from left to right, eg historyLogger is called last
  const { store, dispatch } = useReducerWithMiddleware<typeof todoReducer>(todoReducer, initialState)([
    lowerConsoleLogger,
    upperConsoleLogger,
    historyLogger,
  ]);

```

 
