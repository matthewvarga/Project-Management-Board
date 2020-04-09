import React, {Component} from 'react';
import './styles';

class TicketDetails extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className={"ticket_details " + (this.props.className ? this.props.className : "")} >
                <div className={"ticket_details_col"}>
                    <div className={"ticket_details_row"}>
                        <h5 className={"ticket_details_title"}>Repository:</h5>
                        <span className={"ticket_details_value"}>{this.props.repo || "None"}</span>
                    </div>
                    <div className={"ticket_details_row"}>
                        <h5 className={"ticket_details_title"}>Branch:</h5>
                        <span className={"ticket_details_value"}>{this.props.branch || "None"}</span>
                    </div>
                    <div className={"ticket_details_row"}>
                        <h5 className={"ticket_details_title"}>Assignee:</h5>
                        <span className={"ticket_details_value"}>{this.props.assignee || "None"}</span>
                    </div>
                </div>
                <div className={"ticket_details_col"}>
                    <div className={"ticket_details_row"}>
                        <h5 className={"ticket_details_title"}>Story Points:</h5>
                        <span className={"ticket_details_value"}>{this.props.points || "None"}</span>
                    </div>
                    <div className={"ticket_details_row"}>
                        <h5 className={"ticket_details_title"}>Date created:</h5>
                        <span className={"ticket_details_value"}>{this.props.dateCreated || "None"}</span>
                    </div>
                    <div className={"ticket_details_row"}>
                        <h5 className={"ticket_details_title"}>Created by:</h5>
                        <span className={"ticket_details_value"}>{this.props.author || "None"}</span>
                    </div>
                </div>
            </div>
        )
    }
}


export default TicketDetails;