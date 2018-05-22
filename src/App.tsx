import * as React from 'react';
import { ITimer, ITimerState } from "./@types";
import { Timer, getHumanFormatedTime } from "./Timer"
import { Audio } from "./Audio";
import { Title } from "./Title";
import { Logger } from "./Logger";

import bell from "./assets/sounds/bell.mp3";
import bellx2 from "./assets/sounds/bellx2.mp3";

export interface IAppState extends ITimerState { }

interface IAppProps { }

export default class App extends React.PureComponent<IAppProps, IAppState> {

  static getResetTimersState = (state: IAppState, props?: IAppProps) => (state.timers.map(t => ({ ...t, current: 0 })));

  static getNextTimer = (state: IAppState, props?: IAppProps) => {
    if (state.currentTimerIndex >= state.timers.length - 1 || state.currentTimerIndex < 0) {
      return 0;
    }
    return state.currentTimerIndex + 1;
  }

  static getPreviousTimer = (state: IAppState, props?: IAppProps) => {
    if (state.currentTimerIndex <= 0) {
      return state.timers.length - 1;
    }
    return state.currentTimerIndex - 1;
  }

  static goToNextTimer = (state: IAppState, props?: IAppProps) => ({
    currentTimerIndex: App.getNextTimer(state, props),
    timers: App.getResetTimersState(state, props),
    playing: true,
  })

  static goToPreviousTimer = (state: IAppState, props?: IAppProps) => ({
    currentTimerIndex: App.getPreviousTimer(state, props),
    timers: App.getResetTimersState(state, props),
    playing: true,
  })

  static incrementCurrentTimer = (state: IAppState, props?: IAppProps) => {
    const timer = state.timers[state.currentTimerIndex];
    return ({
      timers: state.timers.map((t, i) => {
        if (i === state.currentTimerIndex) {
          return ({ ...t, current: Math.min(timer.current + 1000, timer.duration) })
        }
        return t;
      })
    })
  }

  static getResetTimerState = (state: IAppState, props?: IAppProps) => ({
    currentTimerIndex: 0,
    playing: false,
    timers: App.getResetTimersState(state, props),
  })

  static togglePlayState = (state: IAppState, props?: IAppProps) => ({
    playing: !state.playing,
  });

  static getInitialState = (): IAppState => ({
    currentTimerIndex: 0,
    playing: false,
    timers: [
      {
        name: "work",
        duration: 15 * 60 * 1000, // 15 min
        current: 0,
        audioURL: bell,
      },
      {
        name: "pause",
        duration: 5 * 60 * 1000, // 5 min
        current: 0,
        audioURL: bellx2,
      }
    ]
  });

  private timer: NodeJS.Timer;
  private audio = React.createRef<Audio>();

  constructor(props: IAppProps) {
    super(props);
    this.timer = setInterval(this.timerCallback, 1000);
  }

  public state: IAppState = App.getInitialState();

  private timerCallback = () => {
    if (!this.state.playing) {
      return;
    }
    const timer = this.state.timers[this.state.currentTimerIndex];
    if (timer.current === timer.duration) {
      this.audio.current != null ? this.audio.current.play() : null;
      this.setState(App.goToNextTimer);
      return;
    }
    this.setState(App.incrementCurrentTimer);
  }

  private togglePlay = () => {
    this.setState(App.togglePlayState);
  }

  private reset = () => {
    this.setState(App.getResetTimerState);
  }

  private next = () => {
    this.setState(App.goToNextTimer);
  }

  private previous = () => {
    this.setState(App.goToPreviousTimer);
  }

  public render() {
    const currentTimer = this.state.timers[this.state.currentTimerIndex];
    return (
      <>
        <Audio src={currentTimer.audioURL} ref={this.audio} />
        <button onClick={this.previous}>Previous</button>
        <button onClick={this.togglePlay}>{this.state.playing ? "Pause" : "Play"}</button>
        <button onClick={this.reset}>Reset</button>
        <button onClick={this.next}>Next</button>
        {this.state.timers.map((timer, i) =>
          <React.Fragment key={i}>
            <div />
            <Timer item={timer} active={i === this.state.currentTimerIndex} />
          </React.Fragment>
        )}
        <Logger timerState={this.state} />
        <Title on={this.state.playing} string={`${getHumanFormatedTime(currentTimer.duration - currentTimer.current)} (${currentTimer.name})`} />
      </>
    );
  }
}
