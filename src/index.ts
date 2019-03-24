import {
  Dispatch,
  Reducer,
  ReducerAction,
  ReducerState,
  useReducer
} from 'react';

export interface MiddlewareAPI<S, A> {
  dispatch: Dispatch<A>;
  getState(): S;
}

export type Middleware<S, A> = (api: MiddlewareAPI<S, A>) => DispatchAction<A>;

export function useReducerWithMiddleware<R extends Reducer<any, any>>(
  reducer: Reducer<ReducerState<R>, ReducerAction<R>>,
  initialState: ReducerState<R>
): ApplyMiddleware<R> {
  return (
    middlewares: Array<Middleware<ReducerState<R>, ReducerAction<R>>>
  ) => {
    const [store, dispatch] = useReducer(reducer, initialState);

    const api: MiddlewareAPI<ReducerState<R>, ReducerAction<R>> = {
      getState: () => store,
      dispatch: (action: ReducerAction<R>) => dispatch(action)
    };

    const chain: Array<DispatchAction<ReducerAction<R>>> = middlewares.map(
      middleware => middleware(api)
    );

    return {
      store,
      dispatch: compose(chain)(dispatch)
    };
  };
}

type DispatchAction<A> = (next: Dispatch<A>) => (action: A) => any;

type ApplyMiddleware<R extends Reducer<any, any>> = (
  middlewares: Array<Middleware<ReducerState<R>, ReducerAction<R>>>
) => { store: ReducerState<R>; dispatch: Dispatch<ReducerAction<R>> };

const compose = <A>(fns: Array<DispatchAction<A>>): DispatchAction<A> => {
  if (fns.length === 0) {
    return (_: Dispatch<A>) => (action: A) => action;
  }
  if (fns.length === 1) {
    return fns[0];
  }

  const last = fns[fns.length - 1];
  const rest = fns.slice(0, fns.length - 1);

  return (dispatch: Dispatch<A>) =>
    rest.reduceRight(
      (composed: Dispatch<A>, f: DispatchAction<A>) => f(composed),
      last(dispatch)
    );
};
