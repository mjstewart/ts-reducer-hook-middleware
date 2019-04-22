import * as uuid from 'uuid';
import { ActionCreators, createAction } from '../actions';

export type Omit<K extends keyof T, T> = Pick<T, Exclude<keyof T, K>>;
export type PickNonNull<K extends keyof T, T> = { [P in K]: Exclude<T[P], null> };

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  completedOn: Date | null;
  createdOn: Date;
}

export interface TodoState {
    todos: Todo[];
    history: string[];
  }

export type PreSavedTodo = Pick<Todo, 'title' | 'description'>

export enum ActionType {
  ADD = '@todo/ADD',
  DELETE = '@todo/DELETE',
  TOGGLE = '@todo/TOGGLE',
  CLEAR = '@todo/CLEAR',
  ADD_ACTION_HISTORY = '@todo/ADD_ACTION_HISTORY'
}

const TodoAction = {
  add: (todo: PreSavedTodo) => createAction(ActionType.ADD, todo),
  toggle: (todo: Todo) => createAction(ActionType.TOGGLE, todo),
  delete: (todo: Todo) => createAction(ActionType.DELETE, todo),
  clear: () => createAction(ActionType.CLEAR),
  addActionHistory: (message: string) => createAction(ActionType.ADD_ACTION_HISTORY, message)
};

export type TodoAction = ActionCreators<typeof TodoAction>;



 