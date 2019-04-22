import * as React from 'react';
import { useContext } from 'react';
import { Button, Item } from 'semantic-ui-react';
import { createAction } from '../actions';
import TodoContext from './TodoContext';
import { ActionType, Todo } from './types';

interface Props {
  todo: Todo;
}

const TodoItem: React.FC<Props> = ({ todo }) => {
  const { dispatch } = useContext(TodoContext);

  const handleToggle = () => {
    dispatch(createAction(ActionType.TOGGLE, todo));
  };
  const handleDelete = () => {
    dispatch(createAction(ActionType.DELETE, todo));
  }

  return (
    <Item>
      <Item.Content>
        <Item.Header as="h3" className={todo.completedOn ? 'line-through' : undefined}>{todo.title}</Item.Header>
        {todo.description && <Item.Description>{todo.description}</Item.Description>}
        <Item.Meta>
          <p>Created: {`${todo.createdOn.toLocaleDateString()} ${todo.createdOn.toLocaleTimeString()}`}</p>
          {todo.completedOn && <p>Completed: {`${todo.completedOn.toLocaleDateString()} ${todo.completedOn.toLocaleTimeString()}`}</p>}
        </Item.Meta>
        <Item.Extra>
          <Button color='red' size='mini' floated="right" onClick={handleDelete}>Delete</Button>
          <Button primary={true} size='mini' floated="right" onClick={handleToggle}>
            {todo.completedOn ? 'Mark not done' : 'Complete!'}
          </Button>
         </Item.Extra>
      </Item.Content>
    </Item>
  );
};

export default TodoItem;
