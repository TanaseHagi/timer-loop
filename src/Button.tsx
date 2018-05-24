import * as React from "react";

import playButton from "./assets/buttons/play.svg";
import pauseButton from "./assets/buttons/pause.svg";
import stopButton from "./assets/buttons/stop.svg";
import previousButton from "./assets/buttons/step-backward.svg";
import nextButton from "./assets/buttons/step-forward.svg";
import addButton from "./assets/buttons/plus.svg";
import removeButton from "./assets/buttons/times-circle.svg";

interface IButtonProps {
    type: ButtonTypeEnum;
    active?: boolean;
    style?: React.CSSProperties;
    onClick?(e?: React.MouseEvent<HTMLElement>): void;
}

export enum ButtonTypeEnum {
    PLAY,
    STOP,
    PREVIOUS,
    NEXT,
    ADD,
    REMOVE,
};

const style: React.CSSProperties = {
    width: "2em",
    height: "2em",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    display: "inline-block",
    cursor: "pointer",
};

const getURL = (type: ButtonTypeEnum, active = false) => {
    switch (type) {
        case ButtonTypeEnum.PLAY:
            return active ? pauseButton : playButton;

        case ButtonTypeEnum.STOP:
            return stopButton;

        case ButtonTypeEnum.PREVIOUS:
            return previousButton;

        case ButtonTypeEnum.NEXT:
            return nextButton;

        case ButtonTypeEnum.ADD:
            return addButton;

        case ButtonTypeEnum.REMOVE:
            return removeButton;

        default:
            return "";
    }
}

export const Button: React.StatelessComponent<IButtonProps> = (props) => {
    return (
        <i
            style={{
                backgroundImage: `url("${getURL(props.type, props.active)}")`,
                ...style,
                ...props.style,
            }}
            onClick={props.onClick}
        >
        </i>
    )
}

Button.defaultProps = {
    active: false,
}