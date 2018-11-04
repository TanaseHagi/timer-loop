import * as React from "react";
import { ITimer } from "./@types";
import { Button, ButtonTypeEnum } from "./Button";
import { getHumanFormatedTime } from "./CounterUtil";
import { CounterEditor } from "./CounterEditor";
import * as TimerStyles from "./TimerStyles";

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

const TimerView: React.StatelessComponent<ITimerProps> = props => (
  <div style={{ outline: props.active ? "1px solid gold" : "", ...TimerStyles.style }}>
    <div style={TimerStyles.nameStyle}>{props.item.name}</div>
    <div style={TimerStyles.durationStyle}>
      {getHumanFormatedTime(props.item.duration - props.item.current)}
    </div>
  </div>
);

const TimerEdit: React.StatelessComponent<ITimerProps> = props => (
  <div style={{ outline: props.active ? "1px solid gold" : "", ...TimerStyles.style }}>
    <input value={props.item.name} onChange={props.onChange && props.onChange(ChangeType.NAME)} style={{ ...TimerStyles.nameStyle, ...TimerStyles.inputStyle, width: "100%" }}/>
    <CounterEditor milliseconds={props.item.duration} onChange={props.onChange && props.onChange(ChangeType.DURATION)} />
    <Button type={ButtonTypeEnum.REMOVE} onClick={props.onRemove} style={TimerStyles.buttonStyle} />
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
