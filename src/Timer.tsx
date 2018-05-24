import * as React from "react";
import { ITimer } from "./@types";
import { Button, ButtonTypeEnum } from "./Button";

interface ITimerProps {
  item: ITimer;
  active?: boolean;
  onRemove?(): void;
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
  right: "-1em",
  top: "-1em",
  backgroundColor: "white",
}

export const Timer: React.StatelessComponent<ITimerProps> = props => (
  <div style={{ outline: props.active ? "1px solid gold" : "", ...style }}>
    <div>{props.item.name}</div>
    <div>
      {getHumanFormatedTime(props.item.current)}/{getHumanFormatedTime(props.item.duration)}
    </div>
    <Button type={ButtonTypeEnum.REMOVE} onClick={props.onRemove} style={buttonStyle} />
  </div>
);

Timer.defaultProps = {
  active: false,
}
