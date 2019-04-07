import { Todo, TodoState } from '@todo/types';
import { createContext, useContext } from 'react';
 
const initialState: TodoState = { todos: [] };

export const TodoContext = useContext(createContext(initialState));
