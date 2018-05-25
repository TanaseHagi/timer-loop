export interface ITimer {
    name: string;
    duration: number;
    current: number;
    audioURL: string;
}

export interface ITimerState {
    currentTimerIndex: number;
    playing: boolean;
    timers: ITimer[];
}

export interface ICounterObject {
    s: number;
    m: number;
    h: number;
}
