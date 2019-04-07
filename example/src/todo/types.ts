import * as uuid from 'uuid';
import { action, ActionCreators } from '../actions';

type Omit<K extends keyof T, T> = Pick<T, Exclude<keyof T, K>>;

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  completedOn: Date | null;
  createdOn: Date;
}

export interface TodoState {
    todos: Todo[];
  }

export type PreSavedTodo = Omit<'id' | 'createdOn', Todo>;

export enum ActionType {
  ADD = '@todo/ADD',
  DELETE = '@todo/DELETE',
  TOGGLE = '@todo/TOGGLE',
  CLEAR = '@todo/CLEAR',
}

const TodoAction = {
  add: (todo: PreSavedTodo) => action(ActionType.ADD, todo),
  toggle: (todo: Todo) => action(ActionType.TOGGLE, todo),
  delete: (todo: Todo) => action(ActionType.DELETE, todo),
  clear: () => action(ActionType.CLEAR),
};

export type TodoAction = ActionCreators<typeof TodoAction>;



 