import React, {Component} from 'react';
import './styles';

class TicketDescription extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        if(this.props.desc) {
            return (
                <p className={"ticket_description " + (this.props.className ? this.props.className : "")}>
                    {this.props.desc}
                </p>
            )
        }
        return (
            <p className={"ticket_description " + (this.props.className ? this.props.className : "") + " empty"}>
               No description provided
            </p>
        )
    }
}


export default TicketDescription;