export type Reducer<State, Action = { type: string }> = (
  state: State | undefined,
  action: Action,
) => State;

export interface Store<State, Action = { type: string }> {
  getState(): State;
  dispatch(action: Action): Action;
}

export default function createStore<State, Action = { type: string }>(
  reducer: Reducer<State, Action>,
  preloadedState?: State,
): Store<State, Action> {
  throw new Error("Not implemented!");
}
