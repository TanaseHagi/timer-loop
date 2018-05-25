import * as React from "react";
import { ITimer } from "./@types";
import { Button, ButtonTypeEnum } from "./Button";
import { getHumanFormatedTime } from "./CounterUtil";
import { CounterEditor } from "./CounterEditor";

export enum ChangeType {
  NAME,
  DURATION,
}

interface ITimerProps {
  item: ITimer;
  active?: boolean;
  editing?: boolean;
  onRemove?(): void;
  onChange?(type: ChangeType): (e: React.ChangeEvent<HTMLInputElement> | number) => void;
}

const style: React.CSSProperties = {
  display: "inline-block",
  padding: "1em",
  width: "100%",
  margin: "1em 0",
  boxShadow: "0px 1px 11px -1px #00000061",
  position: "relative",
}

const buttonStyle: React.CSSProperties = {
  position: "absolute",
  height: "100%",
  right: "1em",
  top: "0em",
}

const nameStyle: React.CSSProperties = {
  fontSize: "1.3em",
}

const durationStyle: React.CSSProperties = {
  fontSize: "2em",
}

const inputStyle: React.CSSProperties = {
  border: 0,
  padding: 0,
  margin: 0,
  outline: 0,
};

const TimerView: React.StatelessComponent<ITimerProps> = props => (
  <div style={{ outline: props.active ? "1px solid gold" : "", ...style }}>
    <div style={nameStyle}>{props.item.name}</div>
    <div style={durationStyle}>
      {getHumanFormatedTime(props.item.duration - props.item.current)}
    </div>
    {/* <div>
      {getHumanFormatedTime(props.item.current)}/{getHumanFormatedTime(props.item.duration)}
    </div> */}
  </div>
);

const TimerEdit: React.StatelessComponent<ITimerProps> = props => (
  <div style={{ outline: props.active ? "1px solid gold" : "", ...style }}>
    <input value={props.item.name} onChange={props.onChange && props.onChange(ChangeType.NAME)} style={{ ...nameStyle, ...inputStyle, width: "100%" }}/>
    <CounterEditor milliseconds={props.item.duration} onChange={props.onChange && props.onChange(ChangeType.DURATION)} />
    <Button type={ButtonTypeEnum.REMOVE} onClick={props.onRemove} style={buttonStyle} />
  </div>
);

export const Timer: React.StatelessComponent<ITimerProps> = props =>
  props.editing
    ? <TimerEdit {...props} />
    : <TimerView {...props} />;

Timer.defaultProps = {
  active: false,
  editing: false,
  onChange: () => () => { },
  onRemove: () => { },
}
