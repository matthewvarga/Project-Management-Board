import React, {Component} from 'react';
import IconPlus from "../../../icons/plus";
import Ticket from "./ticket";
import Modal from "../../modal/index";
import NewTicketForm from "../new-ticket-form/index";
import './styles';

class Column extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tickets: props.tickets || []
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // deep prop changes dont propogate to force statechange,
        // so have to manually check and update
        if(prevProps.tickets != this.props.tickets) {
            this.setState({
                tickets: this.props.tickets
            })
        }
    }

    populateTickets(tickets) {
        let tkts = [];
        let len = tickets.length;
        for(let i = 0; i < len; i++) {
            let tkt = tickets[i];
            tkts.push (
                <Ticket title={tkt.title}
                    creator={tkt.creator}
                    number={tkt.number}
                    draggable={"true"} 
                    onDragStart={(e) => {this.props.onTktDragStart(e, tkt.id)}}
                    onDragOver={(e) => {this.props.onTktDragOver(e, tkt.id)}}
                    onDragLeave={(e) => {this.props.onTktDragLeave(e, tkt.id)}}
                    onDragEnd={(e) => {this.props.onTktDragEnd(e, tkt.id)}}
                    key={i}>
                </Ticket>
            )
        }
        return tkts;
    }

    addTicket(e) {
        console.log("add ticket");
    }

    render() {

        // console.log("rendering column");
        return (
            <div className={"column " + (this.props.className ? this.props.className : "") }
                draggable={this.props.draggable}
                onDragStart={(e) => {this.props.onDragStart(e)}}
                onDragOver={(e) => {this.props.onDragOver(e)}}
                onDragEnd={(e) => {this.props.onDragEnd(e)}}
            >
                <div className={"column_header"}>
                    <div className={"column_header_container"}>
                        <span className={"column_num_tickets"}>{this.state.tickets ? "?" : this.state.tickets.length}</span>
                        <h3 className={"column_title"}>{this.props.title || "Board Title"}</h3>
                    </div>
                    <div className={"column_header_container"}>
                        {/* <IconPlus className={"column_plus_icon"} onClick={(e) => this.addTicket(e)}/> */}
                        <Modal button={<IconPlus className={"modal_plus_icon"}/>}
                            title={"create new ticket"}>
                            <NewTicketForm/>
                        </Modal>
                    </div>
                </div>
                <div className={"column_tickets"}>
                    {this.populateTickets(this.state.tickets)}
                </div>
            </div>
        )
    }
}

export default Column;