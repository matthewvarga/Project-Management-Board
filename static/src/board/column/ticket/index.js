import React, {Component} from 'react';
import IconDelete from "../../../../icons/delete";
import {Link} from "react-router-dom";
import { connect } from 'react-redux';
import {setBoard} from "../../../actions/index";
import './styles';

class Ticket extends Component {

    constructor(props) {
        super(props);

        this.tktRef = React.createRef();

        this.state = {
            tkt: props.tktObj || {}
        };
    }

    componentDidUpdate(prevProps, prevState) {
        // deep prop changes dont propogate to force statechange,
        // so have to manually check and update
        if(JSON.stringify(prevProps.tktObj) != JSON.stringify(this.props.tktObj)) {
            this.setState({
                tkt: this.props.tktObj
            });
        }
    }

    deleteTicket() {
        let boardID = this.props.board.id;
        let colID = this.props.colID;
        let tktID = this.state.tkt.id;

        fetch("http://localhost:3000/api/boards/" + boardID + "/columns/" + colID + "/tickets/" + tktID, {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                // 'Content-Type': 'application/json; charset=UTF-8',
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
            <div ref={this.tktRef} className={"ticket " + (this.props.className ? this.props.className : "") }
                draggable={this.props.draggable}
                onDragStart={(e) => {this.props.onDragStart(e)}}
                onDragOver={(e) => {this.props.onDragOver(e)}}
                onDragEnd={(e) => {this.props.onDragEnd(e)}}
                onDragLeave={(e) => {this.props.onDragLeave(e)}}
            >

                <div className={"ticket-header-row"}>
                    <Link to={"/tickets/" + this.state.tkt.id} className={"ticket_title"}>{this.state.tkt.title || "Ticket title"}</Link>
                    <IconDelete className={"delete-icon"} onClick={() => this.deleteTicket()}/>
                </div>
                
                <div className={"ticket_short_desc"}>
                    <span>#{this.state.tkt.number || "?"} opened by {this.state.tkt.creator || "unknown"}</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(Ticket);