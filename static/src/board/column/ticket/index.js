import React, {Component} from 'react';
import './styles';

class Ticket extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        console.log("rendering tickets");
        return (
            <div className={"ticket " + (this.props.className ? this.props.className : "") }
                draggable={this.props.draggable}
                onDragStart={(e) => this.props.onDragStart(e)}
                onDragOver={(e) => {this.props.onDragOver(e)}}
                onDragEnd={(e) => {this.props.onDragEnd(e)}}
            >
                
            </div>
        )
    }
}

export default Ticket;