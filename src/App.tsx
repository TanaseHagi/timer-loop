import * as React from 'react';
import { ITimer, ITimerState } from "./@types";
import { Timer, ChangeType } from "./Timer"
import { getHumanFormatedTime } from "./CounterUtil";
import { Audio } from "./Audio";
import { Title } from "./Title";
import { Logger } from "./Logger";
import { Button, ButtonTypeEnum } from "./Button";
import { ControllerClass } from "./Controller";
import bell from "./assets/sounds/bell.mp3";
import bellx2 from "./assets/sounds/bellx2.mp3";

export interface IAppState extends ITimerState {
  editing: boolean;
}

interface IAppProps {
  controller: ControllerClass;
}

export default class App extends React.PureComponent<IAppProps, IAppState> {

  static getResetTimers = (timers: ITimer[]): ITimer[] => (timers.map(t => ({ ...t, current: 0 })));

  static getNextTimerIndex = (index: number, max: number) => index >= max || index < 0 ? 0 : index + 1;

  static getPreviousTimerIndex = (index: number, max: number) => index <= 0 ? max : index - 1;

  static goToNextTimer = (state: IAppState) => ({
    currentTimerIndex: App.getNextTimerIndex(state.currentTimerIndex, state.timers.length - 1),
    timers: App.getResetTimers(state.timers),
    playing: true,
  })

  static goToPreviousTimer = (state: IAppState) => ({
    currentTimerIndex: App.getPreviousTimerIndex(state.currentTimerIndex, state.timers.length - 1),
    timers: App.getResetTimers(state.timers),
    playing: true,
  })

  static incrementCurrentTimer = (state: IAppState) => {
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

  static getResetTimerState = (state: IAppState) => ({
    currentTimerIndex: 0,
    playing: false,
    timers: App.getResetTimers(state.timers),
  })

  static togglePlayState = (state: IAppState) => ({
    playing: !state.playing,
  });

  static toggleEditState = (state: IAppState): IAppState => ({
    ...App.getResetTimerState(state),
    editing: !state.editing,
  });

  static addNewTimer = (state: IAppState) => ({
    timers: [
      ...state.timers,
      App.getNewTimer(),
    ],
  })

  static removeTimer = (index: number) => (state: IAppState): IAppState => {
    let timers = state.timers.filter((t, i) => i !== index);
    timers = timers.length === 0 ? [App.getNewTimer()] : timers;
    return ({
      ...state,
      timers,
      currentTimerIndex: Math.min(timers.length - 1, state.currentTimerIndex),
    })
  }

  static changeTimer = (index: number, newTimer: Partial<ITimer>) => (state: IAppState): IAppState => {
    let timers = state.timers.map((t, i) =>
      i === index
        ? { ...t, ...newTimer }
        : t
    );
    return ({
      ...state,
      timers,
    })
  }

  static getInitialState = (): IAppState => ({
    ...App.getDefaultState(),
  });

  static getDefaultState = (): IAppState => ({
    editing: false,
    currentTimerIndex: 0,
    playing: false,
    timers: App.getDefaultTimers(),
  });

  static getDefaultTimers = (): ITimer[] => ([
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
  ]);

  static getNewTimer = (() => {
    let newCounter = 1;
    return ((): ITimer => ({
      name: `new ${newCounter++}`,
      duration: 15 * 60 * 1000, // 15 min
      current: 0,
      audioURL: bell,
    }));
  })();

  private timer: NodeJS.Timer;
  private audio = React.createRef<Audio>();

  constructor(props: IAppProps) {
    super(props);
    this.timer = setInterval(this.timerCallback, 1000);
  }

  private getInitialState = () => {
    const timers = this.props.controller.getTimers();
    const state = App.getInitialState();
    if (timers.length > 0) {
      state.timers = timers;
      return state;
    }
    return state;
  }

  public state: IAppState = this.getInitialState();

  public self = App;

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

  private toggleEdit = () => this.setState(App.toggleEditState, () => { !this.state.editing ? this.props.controller.setTimers(this.state.timers) : null });

  private stop = () => this.setState(App.getResetTimerState);

  private next = () => this.setState(App.goToNextTimer);

  private previous = () => this.setState(App.goToPreviousTimer);

  private add = () => this.setState(App.addNewTimer);

  private remove = (index: number) => () => this.setState(App.removeTimer(index));

  private change = (index: number) => (type: ChangeType) => (e: React.ChangeEvent<HTMLInputElement> | number) => {
    switch (type) {
      case ChangeType.NAME:
        typeof e !== "number" && this.setState(App.changeTimer(index, { name: e.target.value }));
        return;

      case ChangeType.DURATION:
        typeof e === "number" && this.setState(App.changeTimer(index, { duration: e }));
        return;

      default:
        break;
    }
  }

  private buttonStyle: React.CSSProperties = {
    flex: 1,
  };

  public render() {
    const currentTimer = this.state.timers[this.state.currentTimerIndex];
    return (
      <div style={{ margin: "auto", width: "250px", marginTop: "2em" }}>
        <div style={{ display: "flex", padding: "1em", width: "100%" }}>
          <Audio src={currentTimer.audioURL} ref={this.audio} />
          <Button type={ButtonTypeEnum.PREVIOUS} onClick={this.previous} style={this.buttonStyle} disabled={this.state.editing} />
          <Button type={ButtonTypeEnum.PLAY} onClick={this.togglePlay} active={this.state.playing} style={this.buttonStyle} disabled={this.state.editing} />
          <Button type={ButtonTypeEnum.STOP} onClick={this.stop} style={this.buttonStyle} disabled={this.state.editing} />
          <Button type={ButtonTypeEnum.NEXT} onClick={this.next} style={this.buttonStyle} disabled={this.state.editing} />
          <Button type={ButtonTypeEnum.EDIT} onClick={this.toggleEdit} active={this.state.editing} style={this.buttonStyle} />
        </div>
        {this.state.timers.map((timer, i) =>
          <React.Fragment key={i}>
            {/* <div /> */}
            <Timer item={timer} active={i === this.state.currentTimerIndex} editing={this.state.editing} onRemove={this.remove(i)} onChange={this.change(i)} />
          </React.Fragment>
        )}
        {/* <Logger timerState={this.state} /> */}
        <Title on={this.state.playing} string={`${getHumanFormatedTime(currentTimer.duration - currentTimer.current)} (${currentTimer.name})`} />
        {
          this.state.editing
            ? <div style={{ display: "flex", padding: "1em", width: "100%" }}>
              <Button type={ButtonTypeEnum.ADD} onClick={this.add} style={this.buttonStyle} />
            </div>
            : null
        }
      </div>
    );
  }
}
