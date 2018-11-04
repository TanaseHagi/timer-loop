import * as React from "react";
import { ICounterObject } from "./@types";
import { getMilliseconds, getTimeObject, timeRange, getTwoDigitString } from "./CounterUtil";
import ReactDOM from "react-dom";
import * as TimerStyles from "./TimerStyles";

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

  private measurementThingy = React.createRef<HTMLSpanElement>();

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

  getMeasurement = () => {
    if (this.measurementThingy.current == null) { return 0; }
    return this.measurementThingy.current.getBoundingClientRect().width;
  }

  render() {
    const width = this.getMeasurement();
    console.log(width)
    return (
      <>
        <div style={{ fontSize: "2em" }}>
          <input value={getTwoDigitString(this.state.h)} onChange={this.change(CounterPart.HOURS)} style={{...inputStyle, width}} size={1} />:
          <input value={getTwoDigitString(this.state.m)} onChange={this.change(CounterPart.MINUTES)} style={{...inputStyle, width}} size={1} />:
          <input value={getTwoDigitString(this.state.s)} onChange={this.change(CounterPart.SECONDS)} style={{...inputStyle, width}} size={1} />
        </div>
        <span ref={this.measurementThingy} style={{
          ...TimerStyles.durationStyle,
          position: "absolute",
          top: "-1000px",
          left: "-1000px",
        }}>55</span>
      </>
    );
  }
}
