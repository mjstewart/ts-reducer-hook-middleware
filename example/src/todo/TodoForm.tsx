import * as React from 'react';
import { useContext, useState } from 'react';
import { Button, Form, Header } from 'semantic-ui-react';
import { createAction } from '../actions';
import TodoContext from './TodoContext';
import { ActionType, PickNonNull, PreSavedTodo } from './types';

type PreSavedTodoForm = PickNonNull<keyof PreSavedTodo, PreSavedTodo>;

const TodoForm: React.FC = () => {
  const { dispatch } = useContext(TodoContext);

  const initialFormState = { title: '', description: '' };
  const [formState, setFormState] = useState<PreSavedTodoForm>(initialFormState);
  
  const onChange = <K extends keyof PreSavedTodo>(name: K) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      createAction(ActionType.ADD, {
        title: formState.title,
        description: formState.description === '' ? null : formState.description
      }),
    );
    setFormState(initialFormState);
  };

  return (
    <div>
      <Header as="h1">Add your todo!</Header>
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Title</label>
          <input placeholder="Title" onChange={onChange('title')} value={formState.title} />
        </Form.Field>
        <Form.Field>
          <label>Description</label>
          <input placeholder="Description" onChange={onChange('description')} value={formState.description} />
        </Form.Field>
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
};

export default TodoForm;
