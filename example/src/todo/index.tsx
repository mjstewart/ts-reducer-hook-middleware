import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import { Middleware, useReducerWithMiddleware } from 'ts-reducer-hook-middleware';
import uuid from 'uuid/v4';
import { createAction } from '../actions';
import { todoReducer } from './reducers';
import TodoContext from './TodoContext';
import TodoForm from './TodoForm';
import TodoHistory from './TodoHistory';
import TodoList from './TodoList';
import { ActionType, TodoAction, TodoState } from './types';

const upperConsoleLogger: Middleware<TodoState, TodoAction> = api => next => action => {
  console.log(`upperConsoleLogger - NEXT ACTION = ${JSON.stringify(action)}`);
  next(action);
};

const lowerConsoleLogger: Middleware<TodoState, TodoAction> = api => next => action => {
  console.log(`lowerConsoleLogger - next action = ${JSON.stringify(action)}`);
  next(action);
};

const historyLogger: Middleware<TodoState, TodoAction> = api => next => action => {
  console.log('historyLogger');
  api.dispatch(createAction(ActionType.ADD_ACTION_HISTORY, action.type));
  next(action);
};

const initialState: TodoState = {
  todos: [
    {
      id: uuid(),
      title: 'Do the washing',
      description: 'life admin',
      createdOn: new Date(),
      completedOn: null,
    },
  ],
  history: [],
};

const TodoApp: React.FC = () => {
  const { store, dispatch } = useReducerWithMiddleware<typeof todoReducer>(todoReducer, initialState)([
    lowerConsoleLogger,
    upperConsoleLogger,
    historyLogger,
  ]);

  return (
    <TodoContext.Provider value={{ store, dispatch }}>
      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column>
            <TodoForm />
          </Grid.Column>
          <Grid.Column>
            <TodoHistory />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <TodoList />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </TodoContext.Provider>
  );
};

export default TodoApp;
