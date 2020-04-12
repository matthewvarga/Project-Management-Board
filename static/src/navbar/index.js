import React, {Component} from 'react';
import {Link} from "react-router-dom";
import { connect } from 'react-redux';
import {Redirect} from "react-router-dom";
import {setBoard} from '../actions/index';
import './styles';

class NavBar extends Component {

    constructor(props) {
        super(props);

        this.state={
            isLoggedOut: false
        }
    }

    logout() {
        fetch("https://project-management.tools/api/signout", {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
            }
        }).then((response) => {
            // error
            if (!response.ok) return;
            this.props.setBoard(null);
            this.setState({
                isLoggedOut: true
            });
        });
    }


    render() {
        if(this.state.isLoggedOut) {
            return (
                <Redirect to={"/"} />
            )
        }
        return (
            <div className={"navbar " + (this.props.className ? this.props.className : "")} >
                <div className={"navbar_content"}>
                    <span className={"navbar_links"}>
                        <Link to={"/dashboard"} className={"navbar_link"}>Dashboard</Link>
                        <span className={"navbar_divider"}> > </span>
                        <Link to={this.props.ticket} className={"navbar_link_active"}>Ticket #{this.props.ticket}</Link>
                    </span>
                    
                    <a className={"navbar_logout"} onClick={() => this.logout()}>Logout</a>
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

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);