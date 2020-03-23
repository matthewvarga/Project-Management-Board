import React, {Component} from 'react';
import IconPlus from "../../../icons/plus";
import Ticket from "./ticket";
import Modal from "../../modal/index";
import NewTicketForm from "../new-ticket-form/index";
import './styles';
import IconDelete from '../../../icons/delete';
import { connect } from 'react-redux';
import {setBoard} from "../../actions/index";

class Column extends Component {

    constructor(props) {
        super(props);

        this.modalRef = React.createRef();
        
        
        this.state = {
            col: props.colObj || {}
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // deep prop changes dont propogate to force statechange,
        // so have to manually check and update
        if(JSON.stringify(this.state.col) != JSON.stringify(this.props.colObj)) {
            this.setState({
                col: this.props.colObj
            });
        }
    }

    closeCreateTicketModal() {
        this.modalRef.current.closeModal();
    }

    populateTickets(tickets) {
        let tkts = [];
        let len = tickets.length;
        for(let i = 0; i < len; i++) {
            let tkt = tickets[i];
            tkts.push (
                <Ticket 
                    tktObj={tkt}
                    colID={this.state.col.id}
                    draggable={"true"} 
                    onDragStart={(e) => {this.props.onTktDragStart(e, tkt.id)}}
                    onDragOver={(e) => {this.props.onTktDragOver(e, tkt.id)}}
                    onDragLeave={(e) => {this.props.onTktDragLeave(e, tkt.id)}}
                    onDragEnd={(e) => this.props.onTktDragEnd(e, tkt.id)}
                    key={i}>
                </Ticket>
            )
        }
        return tkts;
    }

    deleteCol(e) {
        fetch("http://localhost:3000/api/boards/" + this.props.board.id + "/columns/" + this.state.col.id + "/", {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {

            // error
            if (!response.ok) return;

            // if response is okay, read data
            response.json().then(data => {


                // update store
                this.props.setBoard(data);
            });   
        });
    }

    render() {
        return (
            <div className={"column " + (this.props.className ? this.props.className : "") }
                draggable={this.props.draggable}
                onDragStart={(e) => {this.props.onDragStart(e)}}
                onDragOver={(e) => {this.props.onDragOver(e)}}
                onDragEnd={(e) => {this.props.onDragEnd(e)}}
            >
                <div className={"column_header"}>
                    <div className={"column_header_container"}>
                        <span className={"column_num_tickets"}>{this.state.col.tickets ? this.state.col.tickets.length: "?"}</span>
                        <h3 className={"column_title"}>{this.state.col.title || "Board Title"}</h3>
                    </div>
                    <div className={"column_header_container"}>
                        {/* <IconPlus className={"column_plus_icon"} onClick={(e) => this.addTicket(e)}/> */}
                        <Modal ref={this.modalRef} button={<IconPlus className={"modal_plus_icon"} onClick={() => {}}/>}
                            title={"create new ticket"}>
                            <NewTicketForm colID={this.state.col.id} onSubmitTicket={() => this.closeCreateTicketModal()}/>
                        </Modal>
                        <IconDelete className={"delete-col"} onClick={() => this.deleteCol()}/>
                    </div>
                </div>
                <div className={"column_tickets"}>
                    {this.populateTickets(this.state.col.tickets)}
                </div>
            </div>
        )
    }
}


// redux
const mapStateToProps = (state, ownProps) => ({
    board: state.board
});

// dispach 
const mapDispatchToProps = dispatch => ({
    setBoard: board => dispatch(setBoard(board))
});

export default connect(mapStateToProps, mapDispatchToProps)(Column);