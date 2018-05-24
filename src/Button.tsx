import * as React from "react";

import playButton from "./assets/buttons/play.svg";
import pauseButton from "./assets/buttons/pause.svg";
import stopButton from "./assets/buttons/stop.svg";
import previousButton from "./assets/buttons/step-backward.svg";
import nextButton from "./assets/buttons/step-forward.svg";
import addButton from "./assets/buttons/plus.svg";
import removeButton from "./assets/buttons/times-circle.svg";
import editButton from "./assets/buttons/edit.svg";
import saveButton from "./assets/buttons/save.svg";

interface IButtonProps {
    type: ButtonTypeEnum;
    active?: boolean;
    style?: React.CSSProperties;
    disabled?: boolean;
    onClick?(e?: React.MouseEvent<HTMLElement>): void;
}

export enum ButtonTypeEnum {
    PLAY,
    STOP,
    PREVIOUS,
    NEXT,
    ADD,
    REMOVE,
    EDIT,
};

const style: React.CSSProperties = {
    width: "2em",
    height: "2em",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    display: "inline-block",
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

        case ButtonTypeEnum.EDIT:
            return active ? saveButton : editButton;

        default:
            return "";
    }
}

export const Button: React.StatelessComponent<IButtonProps> = (props) => {
    return (
        <i
            style={{
                backgroundImage: `url("${getURL(props.type, props.active)}")`,
                opacity: props.disabled ? 0.3 : 1,
                cursor: props.disabled ? "auto" : "pointer",
                ...style,
                ...props.style,
            }}
            onClick={!props.disabled ? props.onClick : undefined}
        >
        </i>
    )
}

Button.defaultProps = {
    active: false,
    disabled: false,
}