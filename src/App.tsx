import * as React from 'react';
import { ITimer } from "./@types";
import { Timer, getHumanFormatedTime } from "./Timer"
import { Audio } from "./Audio";
import { Title } from "./Title";

import bell from "./assets/sounds/bell.mp3";
import bellx2 from "./assets/sounds/bellx2.mp3";

interface IAppState {
  currentTimerIndex: number;
  playing: boolean;
  timers: ITimer[];
}

interface IAppProps { }

export default class App extends React.PureComponent<IAppProps, IAppState> {
  private timer: NodeJS.Timer;
  private audio = React.createRef<Audio>();

  constructor(props: IAppProps) {
    super(props);
    this.timer = setInterval(this.timerCallback, 1000);
  }

  public state: IAppState = {
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
  };

  private logs: string[] = [];

  private getNextTimer = () => {
    if (this.state.currentTimerIndex >= this.state.timers.length - 1 || this.state.currentTimerIndex < 0) {
      return 0;
    }
    return this.state.currentTimerIndex + 1;
  }

  private timerCallback = () => {
    if (!this.state.playing) {
      return;
    }
    const timer = this.state.timers[this.state.currentTimerIndex];
    if (timer.current === timer.duration) {
      this.audio.current != null ? this.audio.current.play() : null;
      this.setState({
        currentTimerIndex: this.getNextTimer(),
        timers: this.getResetTimersState(),
      });
      return;
    }
    this.setState({
      timers: this.state.timers.map((t, i) => {
        if (i === this.state.currentTimerIndex) {
          return ({ ...t, current: Math.min(timer.current + 1000, timer.duration) })
        }
        return t;
      })
    });
  }

  private togglePlay = () => {
    this.setState({
      playing: !this.state.playing,
    });
  }

  private reset = () => {
    this.setState({
      currentTimerIndex: 0,
      playing: false,
      timers: this.getResetTimersState(),
    });
  }

  private next = () => {
    this.setState({
      currentTimerIndex: this.getNextTimer(),
      playing: true,
      timers: this.getResetTimersState(),
    });
  }

  private getResetTimersState = () => (this.state.timers.map(t => ({ ...t, current: 0 })));

  public logStuff(prevProps: IAppProps, prevState: IAppState) {
    if (prevState.playing !== this.state.playing || prevState.currentTimerIndex !== this.state.currentTimerIndex) {
      const log = `${JSON.stringify(this.state)}`;
      this.logs.push(log);
      console.log(`log: `, this.state);
    }
  }

  public componentDidUpdate(prevProps: IAppProps, prevState: IAppState) {
    this.logStuff(prevProps, prevState);
  }

  public render() {
    const currentTimer = this.state.timers[this.state.currentTimerIndex];
    return (
      <>
        <Audio src={currentTimer.audioURL} ref={this.audio} />
        <button onClick={this.togglePlay}>{this.state.playing ? "Pause" : "Play"}</button>
        <button onClick={this.reset}>Reset</button>
        <button onClick={this.next}>Next</button>
        {this.state.timers.map((timer, i) =>
          <React.Fragment key={i}>
            <div />
            <Timer item={timer} active={i === this.state.currentTimerIndex} />
          </React.Fragment>
        )}
        <Title on={this.state.playing} string={`${getHumanFormatedTime(currentTimer.duration - currentTimer.current)} (${currentTimer.name})`} />
      </>
    );
  }
}
