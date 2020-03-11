import React, {Component} from 'react';
import IconClose from "../../icons/close";
import './styles';

class Modal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false
        };
    }


    openModal() {
        // prevent scroll on html
        let htmlEl = document.documentElement;
        htmlEl.style.overflow= "hidden";
        // set modal state to open
        this.setState({
            isOpen: true
        });
    }

    closeModal() {
        // allow scroll on html
        let htmlEl = document.documentElement;
        htmlEl.style.overflow= "auto";
        // set modal state to closed
        this.setState({
            isOpen: false
        });
    }


    render() {
        return (
            <div className={"modal " + (this.props.className ? this.props.className : "")} >
                <span onClick={() => this.openModal()}>{this.props.button || "+"}</span>
                {this.state.isOpen &&
                    <div className={"modal_background"} onClick={() => this.closeModal()}>
                        <div className={"modal_content"} onClick={(e) => e.stopPropagation()}>
                            <span className={"modal_header_row"}>
                                {this.props.title && <h2>{this.props.title}</h2>}
                                <IconClose className={"modal_close_icon"} onClick={() => this.closeModal()}/>
                            </span>
                            {this.props.children}
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default Modal;