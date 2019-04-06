import * as React from 'react';
import { Reducer } from 'react';
import * as renderer from 'react-test-renderer';
import { useReducerWithMiddleware } from './index';

/* tslint:disable:no-empty */
const voidDispatch = () => {};

interface TestState {
  logs: string[];
}

interface TestAction {
  type: 'log';
  log: string;
}

const logAction: (log: string) => TestAction = (log: string) => ({
  type: 'log',
  log,
});

const testReducer: Reducer<TestState, TestAction> = (state: TestState, action: TestAction) => {
  switch (action.type) {
    case 'log':
      return {
        ...state,
        logs: [...state.logs, action.log],
      };
  }
};

test('middlewares called from left to right when the next dispatch function is called last', () => {
  // given middlewares [a, b, c], calling the next dispatch last is the same as a loop which runs in sequence.

  let dispatch: React.Dispatch<TestAction> = voidDispatch;
  const TestCounter: React.SFC = () => {
    const { store, dispatch: enhancedDispatch } = useReducerWithMiddleware<typeof testReducer>(testReducer, {
      logs: [],
    })([
      api => next => action => {
        api.dispatch(logAction('middlewareOne'));
        next(action);
      },
      api => next => action => {
        api.dispatch(logAction('middlewareTwo'));
        next(action);
      },
      api => next => action => {
        api.dispatch(logAction('middlewareThree'));
        next(action);
      },
    ]);

    dispatch = enhancedDispatch;
    return (
      <div>
        <ul>
          {store.logs.map(log => (
            <li key={log}>{log}</li>
          ))}
        </ul>
      </div>
    );
  };

  const testRenderer = renderer.create(<TestCounter />);
  const testInstance = testRenderer.root;

  renderer.act(() => {
    dispatch(logAction('initial'));
  });

  expect(testInstance.findAllByType('li')[0].children[0]).toBe('middlewareOne');
  expect(testInstance.findAllByType('li')[1].children[0]).toBe('middlewareTwo');
  expect(testInstance.findAllByType('li')[2].children[0]).toBe('middlewareThree');

  // last call to the next dispatcher in middlewareThree ends up running the original action supplied to the composed dispatcher.
  expect(testInstance.findAllByType('li')[3].children[0]).toBe('initial');
});

test('middlewares called from right to left when the next dispatch function is called first', () => {
  // given middlewares [a, b, c], calling the 'next' dispatch first is the same as recursing as deep as possible until 'c'.
  // 'c' is essentially the base case triggering the original action passed into the composed dispatcher.
  // Finally, unwind back to 'a' which calls the original dispatch function that hits the reducer.

  let dispatch: React.Dispatch<TestAction> = voidDispatch;
  const TestCounter: React.SFC = () => {
    const { store, dispatch: enhancedDispatch } = useReducerWithMiddleware<typeof testReducer>(testReducer, {
      logs: [],
    })([
      api => next => action => {
        next(action);
        api.dispatch(logAction('middlewareOne'));
      },
      api => next => action => {
        next(action);
        api.dispatch(logAction('middlewareTwo'));
      },
      api => next => action => {
        next(action);
        api.dispatch(logAction('middlewareThree'));
      },
    ]);

    dispatch = enhancedDispatch;

    return (
      <div>
        <ul>
          {store.logs.map(log => (
            <li key={log}>{log}</li>
          ))}
        </ul>
      </div>
    );
  };

  const testRenderer = renderer.create(<TestCounter />);
  const testInstance = testRenderer.root;

  renderer.act(() => {
    dispatch(logAction('initial'));
  });

  expect(testInstance.findAllByType('li')[0].children[0]).toBe('initial');
  expect(testInstance.findAllByType('li')[1].children[0]).toBe('middlewareThree');
  expect(testInstance.findAllByType('li')[2].children[0]).toBe('middlewareTwo');
  expect(testInstance.findAllByType('li')[3].children[0]).toBe('middlewareOne');
});

test('middlewares can read initial store', () => {
  const initialState: TestState = { logs: ['initialState'] };
  let store: TestState = initialState;
  let dispatch: React.Dispatch<TestAction> = voidDispatch;

  const TestCounter: React.SFC = () => {
    const { store: initialStore, dispatch: enhancedDispatch } = useReducerWithMiddleware<typeof testReducer>(
      testReducer,
      initialState,
    )([
      api => next => action => {
        api.dispatch(logAction(`middlewareOne, ${api.getState().logs}`));
        next(action);
      },
      api => next => action => {
        api.dispatch(logAction(`middlewareTwo, ${api.getState().logs}`));
        next(action);
      },
      api => next => action => {
        api.dispatch(logAction(`middlewareThree, ${api.getState().logs}`));
        next(action);
      },
    ]);

    dispatch = enhancedDispatch;
    store = initialStore;

    return (
      <div>
        <ul>
          {store.logs.map(log => (
            <li key={log}>{log}</li>
          ))}
        </ul>
      </div>
    );
  };

  const testRenderer = renderer.create(<TestCounter />);
  const testInstance = testRenderer.root;

  renderer.act(() => {
    dispatch(logAction(`first, ${initialState.logs}`));
  });

  // initial store state
  expect(testInstance.findAllByType('li')[0].children[0]).toBe('initialState');

  // dispatch effects
  expect(testInstance.findAllByType('li')[1].children[0]).toBe('middlewareOne, initialState');
  expect(testInstance.findAllByType('li')[2].children[0]).toBe('middlewareTwo, initialState');
  expect(testInstance.findAllByType('li')[3].children[0]).toBe('middlewareThree, initialState');

  // last call to the next dispatcher in middlewareThree ends up running the original action supplied to the composed dispatcher.
  expect(testInstance.findAllByType('li')[4].children[0]).toBe('first, initialState');
});
