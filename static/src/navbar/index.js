import React, {Component} from 'react';
import {Link} from "react-router-dom";
import './styles';

class NavBar extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className={"navbar " + (this.props.className ? this.props.className : "")} >
                <div className={"navbar_content"}>
                    <span className={"navbar_links"}>
                        <Link to={"/dashboard"} className={"navbar_link"}>Dashboard</Link>
                        <span className={"navbar_divider"}> > </span>
                        <Link to={"/tickets/"+ this.props.ticket} className={"navbar_link_active"}>Ticket #{this.props.ticket}</Link>
                    </span>
                    
                    <a className={"navbar_logout"}>Logout</a>
                </div>
            </div>
        )
    }
}


export default NavBar;