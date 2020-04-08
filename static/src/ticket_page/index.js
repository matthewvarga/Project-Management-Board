import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Link} from "react-router-dom";
import {setBoard} from '../actions/index';
import './styles';

class TicketPage extends Component {

    constructor(props) {
        super(props);

        this.id = props.match.params.id;
        console.log(this.props.board);

        let ticket = {};
        // retrieve ticket obj from board
        for(let i = 0; i < this.props.board.columns.length; i++) {
            for(let j = 0; j < this.props.board.columns[i].tickets.length; j++) {
                let tkt = this.props.board.columns[i].tickets[j];
                if(tkt.id == this.id) {
                    ticket = tkt;
                    console.log(tkt);
                }
            }
        }

        this.state = {
            ticket: ticket
        }
    }


    render() {
        return (
            <div className={"ticket_page " + (this.props.className ? this.props.className : "")} >
               <div className={"ticket_content"}>
                   <div className={"ticket_page_header_row"}>
                        <Link to={"/dashboard"}>Back</Link>
                        <div className={"ticket_page_header"}>
                            <h1 className={"ticket_page_title"}>{this.state.ticket.title || "Ticket Title"}</h1>
                            <span className={"ticket_page_header_desc"}>?author? opened this ticket on ?date?</span>
                        </div>
                   </div>
                   <div className={"ticket_page_content_row"}>
                        <h2 className={"ticket_page_content_row_title"}>Details</h2>
                        <span className={"ticket_page_content_row_line"}></span>
                   </div>
                   <div className={"ticket_page_content_row"}>
                        <h2 className={"ticket_page_content_row_title"}>Description</h2>
                        <span className={"ticket_page_content_row_line"}></span>
                   </div>
                   <div className={"ticket_page_content_row"}>
                        <h2 className={"ticket_page_content_row_title"}>Comments</h2>
                        <span className={"ticket_page_content_row_line"}></span>
                   </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(TicketPage);