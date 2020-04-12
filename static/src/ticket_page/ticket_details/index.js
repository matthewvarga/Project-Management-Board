import React, {Component} from 'react';
import IconDownChevron from '../../../icons/chevron_down';
import Dropdown from '../../dropdown/index';
import Notification from '../../notification/index';
import './styles';

class TicketDetails extends Component {

    constructor(props) {
        super(props);

        this.notificationRef = React.createRef();

        this.state = {
            branches: [],
            sourceBranchIndex: 0,
            targetBranchIndex: 0
        }

        this.retrieveBranches();
    }

    retrieveBranches() {
        let repo = this.props.repo;

        let slshIndex = repo.indexOf("/");
        slshIndex += 1;
        repo = repo.substring(slshIndex, repo.length)

        fetch("https://project-management.tools/api/" + this.props.author + "/repos/" + repo + "/branches", {
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
                let repoBranches = [];
                for (let i = 0; i < data.length; i++) {
                    repoBranches.push(data[i].name);
                }
                let sourceBranches = repoBranches.slice(2, repoBranches.length);

                this.setState({
                    branches: repoBranches,
                    // branches: sourceBranches
                });
            });   
        });
    }

    selectSourceBranch(e, i) {
        this.setState({
            sourceBranchIndex: i
        });
    }

    selectTargetBranch(e, i) {
        this.setState({
            targetBranchIndex: i
        });
    }

    createPR() {

        let source = this.state.branches[this.state.sourceBranchIndex];
        let target = this.state.branches[this.state.targetBranchIndex];

        let repo = this.props.repo || "";
        let slshIndex = repo.indexOf("/");
        slshIndex += 1;
        repo = repo.substring(slshIndex, repo.length)

        fetch("https://project-management.tools/api/repos/pulls", {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                "src": source,
                "dest": target,
                "title": "from " + source + " to " + target,
                "body": "",
                "repo": repo,
                "owner": this.props.author
            })
        }).then((response) => {
            // error
            if (!response.ok) return;

            // if response is okay, read data
            let notif = this.notificationRef.current;
            notif.open();
        });
    }


    render() {
        return (
            <div className={"ticket_details " + (this.props.className ? this.props.className : "")} >
                <div className={"ticket_details_row_container"}>
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
                            <span className={"ticket_details_value"}>{(this.props.points == null || this.props.points == undefined) ? "None" : this.props.points}</span>
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
                <div className={"ticket_details_row"}>
                    <h5 className={"ticket_details_title create_pr"}>Create Pull request</h5>
                    <span className={"ticket_details_dropdown"}>
                        <h5 className={"ticket_details_title create_pr"}>from: </h5>
                        <Dropdown className={"form_dropdown"} 
                                button={<IconDownChevron className={"form_dropdown_icon"}/>}
                                disabled={false}
                                onSelectItem={(e, i) => this.selectSourceBranch(e, i)}
                                activeIndex={this.state.sourceBranchIndex}>
                                {this.state.branches}
                        </Dropdown>
                    </span>
                    <span className={"ticket_details_dropdown"}>
                        <h5 className={"ticket_details_title create_pr"}>to: </h5>
                        <Dropdown className={"form_dropdown"} 
                                button={<IconDownChevron className={"form_dropdown_icon"}/>}
                                disabled={false}
                                onSelectItem={(e, i) => this.selectTargetBranch(e, i)}
                                activeIndex={this.state.targetBranchIndex}>
                                {this.state.branches}
                        </Dropdown>
                    </span>
                    <div className={"ticket_details_create_btn"} onClick={() => this.createPR()}>create</div>
                </div>
                <Notification ref={this.notificationRef} />
            </div>
        )
    }
}


export default TicketDetails;