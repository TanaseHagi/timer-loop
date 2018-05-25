import { ICounterObject } from "./@types";
import { duration } from "moment";

export const getTimeObject = (milliseconds: number): ICounterObject => {
    const d = duration(milliseconds);
    return ({
        h: d.hours(),
        m: d.minutes(),
        s: d.seconds(),
    });
}

export const getTwoDigitString = (number: number) => `${number < 10 ? "0" : ""}${number}`;

export const getHumanFormatedTime = (milliseconds: number) => {
    const t = getTimeObject(milliseconds);
    return (`${getTwoDigitString(t.h)}:${getTwoDigitString(t.m)}:${getTwoDigitString(t.s)}`);
}

export const getMilliseconds = (time: ICounterObject) => {
    return (
        time.s * 1000 +
        time.m * 60 * 1000 +
        time.h * 60 * 60 * 1000
    );
}

export const timeRange = (min: number, val: number, max: number) => Math.max(min, Math.min(val, max))
