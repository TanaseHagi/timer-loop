import * as React from "react";

interface IAudioProps {
    src: string;
}

interface IAudioState {
    src: string;
}

export class Audio extends React.PureComponent<IAudioProps, IAudioState> {
    private audio = React.createRef<HTMLAudioElement>();
    state: IAudioState = {
        src: this.props.src,
    }
    onAudioEnded = () => {
        this.setState({
            src: this.props.src,
        })
    }
    componentDidMount() {
        if (this.audio.current == null) {
            console.log("audio is broken!");
            return;
        }
        this.audio.current.addEventListener("ended", this.onAudioEnded);
    }
    componentWillUnmount() {
        if (this.audio.current == null) {
            return;
        }
        this.audio.current.removeEventListener("ended", this.onAudioEnded);
    }
    play = () => {
        if (this.audio.current == null) {
            return;
        }
        this.audio.current.play();
    }
    render() {
        return (
            <audio ref={this.audio} src={this.state.src} style={{ display: "none" }} />
        )
    }
}