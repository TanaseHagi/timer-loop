import { ITimer } from "./@types";

enum keys {
    timers = "timers",
}

export class Controller {
    static getTimers = (): ITimer[] => JSON.parse(localStorage.getItem(keys.timers) || "[]");

    static setTimers = (timers: ITimer[]) => {
        localStorage.setItem(keys.timers, JSON.stringify(timers));
    }
}

export type ControllerClass = typeof Controller;
