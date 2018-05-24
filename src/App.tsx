import * as React from 'react';
import { ITimer, ITimerState } from "./@types";
import { Timer, getHumanFormatedTime } from "./Timer"
import { Audio } from "./Audio";
import { Title } from "./Title";
import { Logger } from "./Logger";
import { Button, ButtonTypeEnum } from "./Button";

import bell from "./assets/sounds/bell.mp3";
import bellx2 from "./assets/sounds/bellx2.mp3";

export interface IAppState extends ITimerState { }

interface IAppProps { }

export default class App extends React.PureComponent<IAppProps, IAppState> {

  static getResetTimers = (state: IAppState, props?: IAppProps): ITimer[] => (state.timers.map(t => ({ ...t, current: 0 })));

  static getNextTimerIndex = (state: IAppState, props?: IAppProps) => {
    if (state.currentTimerIndex >= state.timers.length - 1 || state.currentTimerIndex < 0) {
      return 0;
    }
    return state.currentTimerIndex + 1;
  }

  static getPreviousTimerIndex = (state: IAppState, props?: IAppProps) => {
    if (state.currentTimerIndex <= 0) {
      return state.timers.length - 1;
    }
    return state.currentTimerIndex - 1;
  }

  static goToNextTimer = (state: IAppState, props?: IAppProps) => ({
    currentTimerIndex: App.getNextTimerIndex(state, props),
    timers: App.getResetTimers(state, props),
    playing: true,
  })

  static goToPreviousTimer = (state: IAppState, props?: IAppProps) => ({
    currentTimerIndex: App.getPreviousTimerIndex(state, props),
    timers: App.getResetTimers(state, props),
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
      }),
    });
  }

  static getResetTimerState = (state: IAppState, props?: IAppProps) => ({
    currentTimerIndex: 0,
    playing: false,
    timers: App.getResetTimers(state, props),
  })

  static togglePlayState = (state: IAppState, props?: IAppProps) => ({
    playing: !state.playing,
  });

  static addNewTimer = (state: IAppState, props?: IAppProps) => ({
    timers: [
      ...state.timers,
      {
        name: "new",
        duration: 15 * 60 * 1000, // 15 min
        current: 0,
        audioURL: bell,
      }
    ],
  })

  static removeTimer = (index: number) => (state: IAppState, props?: IAppProps) => ({
    timers: state.timers.filter((t, i) => i !== index),
  })

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

  private togglePlay = () => this.setState(App.togglePlayState);

  private reset = () => this.setState(App.getResetTimerState);

  private next = () => this.setState(App.goToNextTimer);

  private previous = () => this.setState(App.goToPreviousTimer);

  private add = () => this.setState(App.addNewTimer);

  private remove = (index: number) => () => {
    if (this.state.timers.length === 1) {
      return;
    }
    if (index === this.state.currentTimerIndex) {
      this.setState(App.getResetTimerState);
    }
    this.setState(App.removeTimer(index));
  }

  private buttonStyle: React.CSSProperties = {
    flex: 1,
  };

  public render() {
    const currentTimer = this.state.timers[this.state.currentTimerIndex];
    return (
      <div style={{ margin: "auto", width: "250px", marginTop: "2em" }}>
        <div style={{ display: "flex", padding: "1em", width: "100%", }}>
          <Audio src={currentTimer.audioURL} ref={this.audio} />
          <Button type={ButtonTypeEnum.PREVIOUS} onClick={this.previous} style={this.buttonStyle} />
          <Button type={ButtonTypeEnum.PLAY} onClick={this.togglePlay} active={this.state.playing} style={this.buttonStyle} />
          <Button type={ButtonTypeEnum.STOP} onClick={this.reset} style={this.buttonStyle} />
          <Button type={ButtonTypeEnum.NEXT} onClick={this.next} style={this.buttonStyle} />
        </div>
        {this.state.timers.map((timer, i) =>
          <React.Fragment key={i}>
            <div />
            <Timer item={timer} active={i === this.state.currentTimerIndex} onRemove={this.remove(i)} />
          </React.Fragment>
        )}
        <Logger timerState={this.state} />
        <Title on={this.state.playing} string={`${getHumanFormatedTime(currentTimer.duration - currentTimer.current)} (${currentTimer.name})`} />
        <div style={{ display: "flex", padding: "1em", width: "100%", }}>
          <Button type={ButtonTypeEnum.ADD} onClick={this.add} style={this.buttonStyle} />
        </div>
      </div>
    );
  }
}
