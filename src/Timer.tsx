import * as React from "react";
import { ITimer } from "./@types";
import { Button, ButtonTypeEnum } from "./Button";

export enum ChangeType {
  NAME,
  DURATION,
}

interface ITimerProps {
  item: ITimer;
  active?: boolean;
  editing?: boolean;
  onRemove?(): void;
  onChange?(type: ChangeType): (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const getHumanFormatedTime = (milliseconds: number) => {
  const t = parseInt(`${milliseconds / 1000}`);
  let s = ((t % 60));
  let m = Math.floor(t / 60);
  let h = Math.floor(t / 3600);
  s = (s >= 60) ? 0 : s;
  m = (m >= 60) ? 0 : m;
  return (`${h < 10 ? "0" : ""}${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`);
}

const getMilliseconds = (time: string) => {
  const t = time.split(":").reverse();
  return (parseInt(t[0]) * 1000 + parseInt(t[1]) * 60 * 1000 + parseInt(t[2]) * 60 * 60 * 1000);
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

const TimerView: React.StatelessComponent<ITimerProps> = props => (
  <div style={{ outline: props.active ? "1px solid gold" : "", ...style }}>
    <div>{props.item.name}</div>
    <div>
      {getHumanFormatedTime(props.item.current)}/{getHumanFormatedTime(props.item.duration)}
    </div>
  </div>
);

const TimerEdit: React.StatelessComponent<ITimerProps> = props => (
  <div style={{ outline: props.active ? "1px solid gold" : "", ...style }}>
    <div>
      <input value={props.item.name} onChange={props.onChange && props.onChange(ChangeType.NAME)} />
    </div>
    <div>
      {getHumanFormatedTime(props.item.current)}/{getHumanFormatedTime(props.item.duration)}
    </div>
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
