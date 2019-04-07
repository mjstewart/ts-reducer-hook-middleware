import { TodoAction, ActionType, Todo, PreSavedTodo, TodoState } from '@todo/types';
import { Reducer } from 'react';
import * as uuid from 'uuid';

function makeNewTodo(pre: PreSavedTodo): Todo {
    return {
        title: pre.title,
    description: pre.description,
    createdOn: new Date(),
    completedOn: null
    }
}

// export const todoReducer: Reducer<TodoState, TodoAction> = (state, action) => {
//   switch (action.type) {
//     case ActionType.ADD: {
//       return {
//         ...state,
//         todos: [...state.todos, action.payload],
//       };
//     }
//   }
// };
