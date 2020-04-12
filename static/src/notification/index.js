import React, { Component } from "react";
import IconClose from '../../icons/close';
import IconCheck from '../../icons/check';
import './styles';

class Notification extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isOpen: props.isOpen || false
        };
    }

    open() {
        this.setState({
            isOpen: true
        });
    }

    close() {
        this.setState({
            isOpen: false
        });
    }

    render() {
        return (
            <div className={"notification " + " " + (this.state.isOpen ? "" : " hidden")} >
                <div className={"close_row"}>
                    <IconClose className={"icon_close"} onClick={() => this.close()}/>
                </div>
                <div className={"content_row"}>
                    <IconCheck className={"icon_check"} />
                    <div className={"text"}>
                        <span className={"title"}>Success</span>
                        <span className={"desc"}>You have successfully created a PR!</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Notification;