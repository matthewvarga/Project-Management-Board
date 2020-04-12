import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Redirect} from "react-router-dom";
import {setBoard} from '../actions/index';
import ExpandableRow from './expandable_row/index';
import TicketDetails from './ticket_details/index';
import TicketDescription from './ticket_description/index';
import TicketComments from './ticket_comments/index';
import NavBar from '../navbar/index';
import './styles';

class TicketPage extends Component {

    constructor(props) {
        super(props);

        this.id = props.match.params.id;

        this.state = {
            ticket: {},
            ticket_col: 0,
            ticket_num: 0
        }

        if(this.props.board) {
            let ticket = {};
            let ticket_col = null;
            let ticket_num = null;

            // retrieve ticket obj from board
            for(let i = 0; i < this.props.board.columns.length; i++) {
                for(let j = 0; j < this.props.board.columns[i].tickets.length; j++) {
                    let tkt = this.props.board.columns[i].tickets[j];
                    if(tkt.id == this.id) {
                        ticket = tkt;
                        ticket_col = i;
                        ticket_num = j;
                    }
                }
            }

            this.state = {
                ticket: ticket,
                ticket_col: ticket_col,
                ticket_num: ticket_num
            };
        }
        else this.retrieveBoard();
    }

    setTkt() {
        let ticket = {};
        let ticket_col = null;
        let ticket_num = null;
        // retrieve ticket obj from board
        for(let i = 0; i < this.props.board.columns.length; i++) {
            for(let j = 0; j < this.props.board.columns[i].tickets.length; j++) {
                let tkt = this.props.board.columns[i].tickets[j];
                if(tkt.id == this.id) {
                    ticket = tkt;
                    ticket_col = i;
                    ticket_num = j;
                }
            }
        }

        this.setState({
            ticket: ticket,
            ticket_col: ticket_col,
            ticket_num: ticket_num
        });
    }


    retrieveBoard() {
        let username = this.getCookie("username");
        if (!username) return;
        fetch("http://localhost:3000/api/boards/user/" + username + "/", {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
            }
        }).then((response) => {
            // error
            if (!response.ok) return;

            // if response is okay, read data
            response.json().then(data => {
                // update store
                this.props.setBoard(data);
                this.setTkt();
            });   
        });
    }

    getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return null;
    }

    addComment(comment) {
        let newboard = this.props.board;
        newboard.columns[this.state.ticket_col].tickets[this.state.ticket_num].comments.push(
            {
                author: this.props.board.user,
                author_img_url: "",
                msg: comment
            }
        );

        this.props.setBoard(newboard);
        // update board in db
        fetch("http://localhost:3000/api/boards/" + this.props.board.id + "/", {
            method: 'PATCH',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.props.board)
        }).then((response) => {
            // error
            if (!response.ok) return;
        });
        this.setState({
            ticket: newboard.columns[this.state.ticket_col].tickets[this.state.ticket_num]
        });
    }


    render() {
        console.log(this.state.ticket);
        if(!this.getCookie("username")) {
            return (
                <Redirect to={"/"} />
            )
        }
        return (
            <div className={"ticket_page " + (this.props.className ? this.props.className : "")} >
                <NavBar ticket={this.id}/>
                <div className={"ticket_content"}>
                    < div className={"ticket_page_header_row"}>
                        <div className={"ticket_page_header"}>
                            <h1 className={"ticket_page_title"}>{this.state.ticket.title || "Ticket Title"}</h1>
                            <span className={"ticket_page_header_desc"}>{this.state.ticket.creator || "?"} opened this ticket on {this.state.ticket.date_created || "?"}</span>
                        </div>
                    </div>
                    <ExpandableRow title={"Details"} isOpen={true}>
                        <TicketDetails 
                            repo={this.state.ticket.repository}
                            branch={this.state.ticket.branch}
                            assignee={this.state.ticket.assignee}
                            points={this.state.ticket.points}
                            dateCreated={this.state.ticket.date_created}
                            author={this.state.ticket.creator}/>
                    </ExpandableRow>
                    <ExpandableRow title={"Description"} isOpen={true}>
                        <TicketDescription desc={this.state.ticket.description}/>
                    </ExpandableRow>
                    <ExpandableRow title={"Comments"} isOpen={true}>
                        <TicketComments comments={this.state.ticket.comments} onComment={(comment) => this.addComment(comment)}/>
                    </ExpandableRow>
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