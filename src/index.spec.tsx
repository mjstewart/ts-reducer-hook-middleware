import * as React from 'react';
import { Reducer } from 'react';
import { useReducerWithMiddleware } from './index';
import * as renderer from 'react-test-renderer';

const voidDispatch = () => {};

interface TestState {
  count: number;
  history: string[];
}

 type ActionPayload = { value: number, message: string }

type TestAction =
  | { type: 'inc'; payload: ActionPayload }
  | { type: 'dec'; payload: ActionPayload }
  | { type: 'set'; payload: ActionPayload };

const testReducer: Reducer<TestState, TestAction> = (
  state: TestState,
  action: TestAction
) => {
  console.log(`testReducer ${JSON.stringify(action.payload)}`);
  switch (action.type) {
    case 'inc':
      return {
        ...state,
        count: state.count + action.payload.value,
        history: [...state.history, action.payload.message]
      };
    case 'dec':
      return {
        ...state,
        count: state.count - action.payload.value,
        history: [...state.history, action.payload.message]
      };
    case 'set':
      return {
        ...state,
        count: action.payload.value,
        history: [...state.history, action.payload.message]
      };
    default:
      const exhaustiveCheck: never = action;
      throw new Error(`unhandled cases detected ${exhaustiveCheck}`);
  }
};

test('two plus four is 6', () => {
  expect(2 + 2).toBe(4);
});

// const middlewareOne: Middleware<
//   TestState,
//   TestAction
// > = api => next => action => {
//   console.log('in middlewareOne before dispatch');
//   api.dispatch({
//     type: 'set',
//     payload: { value: 17, message: 'middlewareOne' }
//   });
//   next(action);
//   console.log('in middlewareOne after next');
// };

// const middlewareTwo: Middleware<
//   TestState,
//   TestAction
// > = api => next => action => {
//   console.log('in middlewareTwo before dispatch');
//   api.dispatch({
//     type: 'set',
//     payload: { value: 23, message: 'middlewareTwo' }
//   });
//   next(action);
//   console.log('in middlewareTwo after next');
// };

// const middlewareThree: Middleware<
//   TestState,
//   TestAction
// > = api => next => action => {
//   console.log('in middlewareThree before dispatch');
//   api.dispatch({
//     type: 'set',
//     payload: { value: 134, message: 'middlewareThree' }
//   });
//   next(action);
//   console.log('in middlewareThree after next');
// };

test('middlewares called from left to right when the next dispatch function is called last', () => {
  console.log('middlewares called from left to right when the next dispatch function is called last')

  let dispatch: React.Dispatch<TestAction> = voidDispatch;
  const TestCounter: React.SFC = () => {
    const { store, dispatch: enhancedDispatch } = useReducerWithMiddleware<
      typeof testReducer
    >(testReducer, { count: 0, history: [] })([
      api => next => action => { 
        api.dispatch({
          type: 'inc',
          payload: { value: 50, message: 'middlewareOne' }
        });
        next(action);
      },
      api => next => action => { 
        api.dispatch({
          type: 'dec',
          payload: { value: 5, message: 'middlewareTwo' }
        });
        next(action);
      },
      api => next => action => { 
        api.dispatch({
          type: 'inc',
          payload: { value: 100, message: 'middlewareThree' }
        });
        next(action);
      }
    ]);

    dispatch = enhancedDispatch;
    return (
      <div>
        <h1>{store.count}</h1>
        <ul>
          {store.history.map(message => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      </div>
    );
  };

  const testRenderer = renderer.create(<TestCounter />);
  const testInstance = testRenderer.root;

  renderer.act(() => {
    dispatch({ type: 'inc', payload: { value: 1, message: 'initial' } });
  });

  expect(testInstance.findAllByType('h1')[0].children[0]).toBe('146');
 
  expect(testInstance.findAllByType('li')[0].children[0]).toBe('middlewareOne');
  expect(testInstance.findAllByType('li')[1].children[0]).toBe('middlewareTwo');
  expect(testInstance.findAllByType('li')[2].children[0]).toBe('middlewareThree');
  expect(testInstance.findAllByType('li')[3].children[0]).toBe('initial');


  console.log(testInstance.findAllByType('li')[0].children[0]);
  console.log(testInstance.findAllByType('li')[1].children[0]);
  console.log(testInstance.findAllByType('li')[2].children[0]);
  console.log(testInstance.findAllByType('li')[3].children[0]);
});











test('middlewares called from right to left when the next dispatch function is called first', () => {
  console.log('middlewares called from right to left when the next dispatch function is called first')

  let dispatch: React.Dispatch<TestAction> = voidDispatch;
  const TestCounter: React.SFC = () => {
    const { store, dispatch: enhancedDispatch } = useReducerWithMiddleware<
      typeof testReducer
    >(testReducer, { count: 0, history: [] })([
      api => next => action => { 
        next(action);
        api.dispatch({
          type: 'inc',
          payload: { value: 50, message: 'middlewareOne' }
        });
 
      },
      api => next => action => { 
        next(action);
        api.dispatch({
          type: 'dec',
          payload: { value: 5, message: 'middlewareTwo' }
        });
 
      },
      api => next => action => { 
        next(action);
        api.dispatch({
          type: 'inc',
          payload: { value: 100, message: 'middlewareThree' }
        });
  
      }
    ]);

    dispatch = enhancedDispatch;
    return (
      <div>
        <h1>{store.count}</h1>
        <ul>
          {store.history.map(message => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      </div>
    );
  };

  const testRenderer = renderer.create(<TestCounter />);
  const testInstance = testRenderer.root;

  renderer.act(() => {
    dispatch({ type: 'inc', payload: { value: 1, message: 'initial' } });
  });

  expect(testInstance.findAllByType('h1')[0].children[0]).toBe('146');
 
  expect(testInstance.findAllByType('li')[0].children[0]).toBe('initial');
  expect(testInstance.findAllByType('li')[1].children[0]).toBe('middlewareThree');
  expect(testInstance.findAllByType('li')[2].children[0]).toBe('middlewareTwo');
  expect(testInstance.findAllByType('li')[3].children[0]).toBe('middlewareOne');


  console.log(testInstance.findAllByType('li')[0].children[0]);
  console.log(testInstance.findAllByType('li')[1].children[0]);
  console.log(testInstance.findAllByType('li')[2].children[0]);
  console.log(testInstance.findAllByType('li')[3].children[0]);
});