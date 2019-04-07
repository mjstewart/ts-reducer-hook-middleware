export interface SimpleAction<A> {
  type: A;
}

export interface Action<A, P> extends SimpleAction<A> {
  payload: P;
}

export function action<A extends string, P>(type: A, payload: P): Action<A, P>;
export function action<A extends string>(type: A): SimpleAction<A>;
export function action<A extends string, P>(type: A, payload?: P) {
  return payload === undefined ? { type } : { type, payload };
}

export type ActionCreator = (...args: any[]) => any;
export interface ActionCreatorMap {
  [key: string]: ActionCreator;
}
export type ActionCreators<T extends ActionCreatorMap> = ReturnType<T[keyof T]>;
