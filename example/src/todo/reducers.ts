import { Reducer } from 'react';
import { v4 as uuid } from 'uuid';
import { ActionType, PreSavedTodo, Todo, TodoAction, TodoState } from './types';

function createTodo(pre: PreSavedTodo): Todo {
  return {
    id: uuid(),
    title: pre.title,
    description: pre.description,
    createdOn: new Date(),
    completedOn: null,
  };
}

export const todoReducer: Reducer<TodoState, TodoAction> = (state, action) => {
  switch (action.type) {
    case ActionType.ADD: {
      return {
        ...state,
        todos: [...state.todos, createTodo(action.payload)],
      };
    }
    case ActionType.CLEAR: {
      return {
        ...state,
        todos: [],
      };
    }
    case ActionType.DELETE: {
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload.id),
      };
    }
    case ActionType.TOGGLE: {
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.payload.id) {
            return {
              ...todo,
              completedOn: todo.completedOn === null ? new Date() : null,
            };
          } else {
            return todo;
          }
        }),
      };
    }
    case ActionType.ADD_ACTION_HISTORY: {
      return {
        ...state,
        history: [...state.history, action.payload],
      };
    }
    default: {
      const missing: never = action;
      throw new Error(`unhandled cases detected ${missing}`);
    }
  }
};
