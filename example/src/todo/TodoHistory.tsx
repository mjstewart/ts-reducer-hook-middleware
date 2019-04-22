import * as React from 'react';
import { useContext } from 'react';
import { Header, Item } from 'semantic-ui-react';
import TodoContext from './TodoContext';

const TodoHistory: React.FC = () => {
  const { store } = useContext(TodoContext);
  return (
    <div>
      <Header dividing={true} as="h1">
        Action history ({store.history.length})
        <Header.Subheader>Middleware 'historyLogger' will add actions here</Header.Subheader>
      </Header>
      <Item.Group>
        {store.history.map((item, i) => {
          return (
            <Item key={i}>
              <Item.Content>
                <Item.Header as="h3">{item}</Item.Header>
              </Item.Content>
            </Item>
          );
        })}
      </Item.Group>
    </div>
  );
};

export default TodoHistory;
