import * as React from "react";
import { ITimer } from "./@types";

interface ITimerProps {
  item: ITimer;
  active?: boolean;
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

export const Timer: React.StatelessComponent<ITimerProps> = props => (
  <div style={{ outline: props.active ? "1px solid gold" : "", display: "inline-block" }}>
    <div>{props.item.name}</div>
    <div>
      {getHumanFormatedTime(props.item.current)}/{getHumanFormatedTime(props.item.duration)}
    </div>
  </div>
);

Timer.defaultProps = {
  active: false,
}
