import React, {Component} from 'react';
import './styles';

class Ticket extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        // console.log("rendering ticket");
        return (
            <div className={"ticket " + (this.props.className ? this.props.className : "") }
                draggable={this.props.draggable}
                onDragStart={(e) => {this.props.onDragStart(e)}}
                onDragOver={(e) => {this.props.onDragOver(e)}}
                onDragEnd={(e) => {this.props.onDragEnd(e)}}
                onDragLeave={(e) => {this.props.onDragLeave(e)}}
            >

                <h4 className={"ticket_title"}>{this.props.title || "Ticket title"}</h4>
                <div className={"ticket_short_desc"}>
                    <span>#{this.props.number || "?"} opened by {this.props.creator || "unknown"}</span>
                </div>

            </div>
        )
    }
}

export default Ticket;