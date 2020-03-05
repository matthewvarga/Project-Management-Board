import React, {Component} from 'react';
import './styles';

class Column extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tickets: props.tickets || []
        }
    }

    populateTickets(tickets) {
        let tkts = [];
        let len = tickets.length;
        for(let i = 0; i < len; i++) {
            tkts.push (
                <div className={"temp_tkt"} 
                    //  draggable={"true"} 
                    //  onDragStart={(e) => this.dragStart(e, i)}
                    //  onDragOver={(e) => {this.dragOver(e, i)}}
                    //  onDragEnd={(e) => {this.dragEnd(e, i)}}
                    //  onDrop={(e) => {this.dragDrop(e, i)}}
                    key={i}>
                </div>
            )
        }
        return tkts;
    }

    render() {
        return (
            <div className={"column " + (this.props.className ? this.props.className : "") }
                draggable={this.props.draggable}
                onDragStart={(e) => this.props.onDragStart(e)}
                onDragOver={(e) => {this.props.onDragOver(e)}}
                onDragEnd={(e) => {this.props.onDragEnd(e)}}
            >
                <div className={"column_header"}>
                    <h3 className={"column_title"}>{this.props.title || "Board Title"}</h3>
                </div>
                <div className={"column_tickets"}>
                    {this.populateTickets(this.state.tickets)}
                </div>
            </div>
        )
    }
}

export default Column;