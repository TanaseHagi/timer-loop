import * as React from "react";
import { ICounterObject } from "./@types";
import { getMilliseconds, getTimeObject, timeRange, getTwoDigitString } from "./CounterUtil";

interface ICounterEditorProps {
  milliseconds: number;
  onChange?(miliseconds: number): void;
}

interface ICounterEditorState extends ICounterObject {

}

enum CounterPart {
  SECONDS,
  MINUTES,
  HOURS,
}

const inputStyle: React.CSSProperties = {
  border: 0,
  padding: 0,
  margin: 0,
  fontSize: "1em",
  textAlign: "center",
  outline: 0,
};

export class CounterEditor extends React.PureComponent<ICounterEditorProps, ICounterEditorState> {

  static onChange = (state: ICounterEditorState, props: ICounterEditorProps) => props.onChange && props.onChange(getMilliseconds(state));

  state: ICounterEditorState = {
    s: 0,
    m: 0,
    h: 0,
  }

  private change = (type: CounterPart) => (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (type) {
      case CounterPart.HOURS: {
        const state: ICounterEditorState = { ...this.state, h: timeRange(0, parseInt(e.target.value) || 0, 23) };
        this.setState(state);
        CounterEditor.onChange(state, this.props);
        return;
      }
      case CounterPart.MINUTES: {
        const state: ICounterEditorState = { ...this.state, m: timeRange(0, parseInt(e.target.value) || 0, 59) };
        this.setState(state);
        CounterEditor.onChange(state, this.props);
        return;
      }
      case CounterPart.SECONDS: {
        const state: ICounterEditorState = { ...this.state, s: timeRange(0, parseInt(e.target.value) || 0, 59) };
        this.setState(state);
        CounterEditor.onChange(state, this.props);
        return;
      }
      default:
        return;
    }
  }

  componentDidMount() {
    this.setState({ ...getTimeObject(this.props.milliseconds) });
  }

  componentDidUpdate() {
    const t = getTimeObject(this.props.milliseconds);
    this.setState({ ...t });
  }

  render() {
    return (
      <div style={{ fontSize: "2em" }}>
        <input value={getTwoDigitString(this.state.h)} onChange={this.change(CounterPart.HOURS)} style={inputStyle} size={1} />:
        <input value={getTwoDigitString(this.state.m)} onChange={this.change(CounterPart.MINUTES)} style={inputStyle} size={1} />:
        <input value={getTwoDigitString(this.state.s)} onChange={this.change(CounterPart.SECONDS)} style={inputStyle} size={1} />
      </div>
    );
  }
}
