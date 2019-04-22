import * as React from 'react';
import { useContext, useState } from 'react';
import { Header, Item } from 'semantic-ui-react';
import TodoContext from './TodoContext';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const { store } = useContext(TodoContext);
  return (
    <div>
      <Header dividing={true} as="h1">Todo's ({store.todos.length})</Header>
      <Item.Group>
        {store.todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
      </Item.Group>
    </div>
  );
};

export default TodoList;
