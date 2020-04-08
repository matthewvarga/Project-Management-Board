import React, {Component} from 'react';
import { connect } from 'react-redux';
import {setBoard} from '../actions/index';
import './styles';

class TicketPage extends Component {

    constructor(props) {
        super(props);

        this.id = props.match.params.id;
        console.log(this.props.board);

        let tkt = {};
        // retrieve ticket obj from board
        for(let i = 0; i < this.props.board.columns.length; i++) {
            for(let j = 0; j < this.props.board.columns[i].tickets.length; j++) {
                tkt = this.props.board.columns[i].tickets[j];
                if(tkt.id == this.id) {
                    console.log(tkt);
                }
            }
        }

        this.state = {
            ticket: tkt
        }
    }


    render() {
        return (
            <div className={"ticket_page " + (this.props.className ? this.props.className : "")} >
               <div className={"ticket_content"}>
                   
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