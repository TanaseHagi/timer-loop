import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App, { IAppState } from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it("getPreviousTimer", () => {
  const state = App.getInitialState();
  const length = state.timers.length;
  
  state.currentTimerIndex = 0;
  let previous = App.getPreviousTimer(state);
  expect(previous).toEqual(length - 1);
  
  state.currentTimerIndex = 1;
  previous = App.getPreviousTimer(state);
  expect(previous).toEqual(0);
});