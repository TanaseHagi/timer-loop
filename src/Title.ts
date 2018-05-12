import * as React from "react";

interface ITitleProps {
    string: string;
    on: boolean;
}

export class Title extends React.PureComponent<ITitleProps> {
    private previousTitle: string = "";
    private applyTitle() {
        document.title = this.props.on ? this.props.string : this.previousTitle;
    }
    componentDidMount() {
        this.previousTitle = document.title;
        this.applyTitle();
    }
    componentDidUpdate() {
        this.applyTitle();
    }
    componentWillUnmount() {
        document.title = this.previousTitle;
    }
    public render() {
        return null;
    }
}
