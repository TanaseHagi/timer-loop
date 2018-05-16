import * as React from "react";
import { ITimer, ITimerState } from "./@types";

interface ILoggerProps {
    timerState: ITimerState;
    logging?: boolean;
}

interface ILoggerState {
    logs: ITimerState[];
}

export class Logger extends React.PureComponent<ILoggerProps, ILoggerState> {

    static defaultProps = {
        logging: false,
    }

    state: ILoggerState = {
        logs: [],
    }

    private addLog = (state: ILoggerState, props: ILoggerProps): ILoggerState => ({
        logs: [...state.logs, props.timerState]
    });

    private getLast<T>(array: T[]) {
        return array[array.length - 1] || {};
    };

    componentDidMount() {
        if (!this.props.logging) {
            return;
        }
        this.logStuff(this.props, this.state);
    }

    public componentDidUpdate() {
        if (!this.props.logging) {
            return;
        }
        this.logStuff(this.props, this.state);
    }

    public logStuff(props: ILoggerProps, state: ILoggerState) {
        if (
            this.getLast(state.logs).playing !== props.timerState.playing
            || this.getLast(state.logs).currentTimerIndex !== props.timerState.currentTimerIndex
        ) {
            this.setState(this.addLog);
        }
    }

    public render() {
        return (
            <>
                {
                    this.state.logs.map((log, i) =>
                        <div key={i}>{log.currentTimerIndex}: {log.playing ? "playing" : "paused"}; </div>
                    )
                }
            </>
        );
    }
}
