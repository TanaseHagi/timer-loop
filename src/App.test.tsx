import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ITimer } from "./@types";
import App, { IAppState } from './App';

export class ControllerMock {
  static timers: ITimer[] = [];
  
  static getTimers = (): ITimer[] => ControllerMock.timers;

  static setTimers = (timers: ITimer[]) => {
      ControllerMock.timers = timers;
  }
}

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App controller={ControllerMock}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});

it("getPreviousTimer", () => {
  const state = App.getInitialState();
  const length = state.timers.length;
  
  state.currentTimerIndex = 0;
  let previous = App.getPreviousTimerIndex(state.currentTimerIndex, state.timers.length - 1);
  expect(previous).toEqual(length - 1);
  
  state.currentTimerIndex = 1;
  previous = App.getPreviousTimerIndex(state.currentTimerIndex, state.timers.length - 1);
  expect(previous).toEqual(0);
});