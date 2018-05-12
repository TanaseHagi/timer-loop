import * as React from 'react';
import { ITimer } from "./@types";
import { Timer, getHumanFormatedTime } from "./Timer"
import { Audio } from "./Audio";
import { Title } from "./Title";

import bell from "./assets/sounds/bell.mp3";
import bellx2 from "./assets/sounds/bellx2.mp3";

interface IAppState {
  currentTimer: number;
  playing: boolean;
  timers: ITimer[];
}

export default class App extends React.PureComponent<{}, IAppState> {
  private timer: NodeJS.Timer;
  private audio = React.createRef<Audio>();

  constructor(props: {}) {
    super(props);
    this.timer = setInterval(this.timerCallback, 1000);
  }

  public state: IAppState = {
    currentTimer: 0,
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

  private getNextTimer = () => {
    if (this.state.currentTimer >= this.state.timers.length - 1 || this.state.currentTimer < 0) {
      return 0;
    }
    return this.state.currentTimer + 1;
  }

  private timerCallback = () => {
    if (!this.state.playing) {
      return;
    }
    const timer = this.state.timers[this.state.currentTimer];
    if (timer.current === timer.duration) {
      this.audio.current != null ? this.audio.current.play() : null;
      this.setState({
        currentTimer: this.getNextTimer(),
        timers: this.getResetTimersState(),
      });
      return;
    }
    this.setState({
      timers: this.state.timers.map((t, i) => {
        if (i === this.state.currentTimer) {
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
      currentTimer: 0,
      playing: false,
      timers: this.getResetTimersState(),
    });
  }

  private next = () => {
    this.setState({
      currentTimer: this.getNextTimer(),
      playing: true,
      timers: this.getResetTimersState(),
    });
  }

  private getResetTimersState = () => (this.state.timers.map(t => ({ ...t, current: 0 })));

  public render() {
    const { currentTimer } = this.state;
    return (
      <>
        <Audio src={this.state.timers[currentTimer].audioURL} ref={this.audio} />
        <button onClick={this.togglePlay}>{this.state.playing ? "Pause" : "Play"}</button>
        <button onClick={this.reset}>Reset</button>
        <button onClick={this.next}>Next</button>
        {this.state.timers.map((t, i) =>
          <React.Fragment key={i}>
            <div />
            <Timer item={t} active={i === currentTimer} />
          </React.Fragment>
        )}
        <Title on={this.state.playing} string={`${getHumanFormatedTime(this.state.timers[currentTimer].current)} (${this.state.timers[currentTimer].name})`} />
      </>
    );
  }
}
