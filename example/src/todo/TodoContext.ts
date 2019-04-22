import { Context, createContext, Dispatch } from 'react';
import { TodoAction, TodoState } from './types';

export interface TodoContext {
  store: TodoState;
  dispatch: Dispatch<TodoAction>;
}

export default createContext({} as TodoContext);
