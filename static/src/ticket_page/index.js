import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Link} from "react-router-dom";
import {setBoard} from '../actions/index';
import ExpandableRow from './expandable_row/index';
import TicketDetails from './ticket_details/index';
import TicketDescription from './ticket_description/index';
import NavBar from '../navbar/index';
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
                <NavBar ticket={this.id}/>
                <div className={"ticket_content"}>
                    < div className={"ticket_page_header_row"}>
                        <div className={"ticket_page_header"}>
                            <h1 className={"ticket_page_title"}>{this.state.ticket.title || "Ticket Title"}</h1>
                            <span className={"ticket_page_header_desc"}>?author? opened this ticket on ?date?</span>
                        </div>
                    </div>
                    <ExpandableRow title={"Details"} isOpen={true}>
                        <TicketDetails 
                            repo={this.state.ticket.repo}
                            branch={this.state.ticket.branch}
                            assignee={this.state.ticket.assignee}
                            points={this.state.ticket.points}
                            dateCreated={this.state.ticket.created_date}
                            author={this.state.ticket.author}/>
                    </ExpandableRow>
                    <ExpandableRow title={"Description"}>
                        <TicketDescription />
                    </ExpandableRow>
                    <ExpandableRow title={"Comments"} />
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