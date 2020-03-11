import React, {Component} from 'react';
import Dropdown from "../../dropdown/index";
import IconDownChevron from "../../../icons/downChevron";
import './styles';

class NewTicketForm extends Component {

    constructor(props) {
        super(props);

        this.mockRepoListData = [
            "None",
            "Repo 1",
            "Repo 2",
            "Repo 3",
            "Repo 4"
        ];

        this.mockBranchData = [
            "Branch 1", 
            "Branch 2",
            "Branch 3"
        ];

        this.mockAssigneeData = [
            "matthew",
            "abi",
            "johnson"
        ];
    }

    createTicket(e) {
        e.preventDefault();

        console.log("submit");
    }

    // TODO: retrieve list from server
    listRepos() {
        return this.mockRepoListData;
    }

    listBranches() {
        return this.mockBranchData;
    }

    listUsers() {
        return this.mockAssigneeData;
    }


    render() {
        return (
            <form className={"new_ticket_form"} onSubmit={this.createTicket.bind(this)}>
                <div className={"form_row"}>
                    <h4 className={"form_label"}>Title</h4>
                    <input  ref={"ticket_title"} type="text" name="ticket_title" placeholder="" />
                </div>

                <div className={"form_row"}>
                    <h4 className={"form_label"}>Link Repository (optional)</h4>
                    <Dropdown className={"form_dropdown"} button={<IconDownChevron className={"form_dropdown_icon"}/>}>
                        {this.listRepos()}
                    </Dropdown>
                </div>
                
                <div className={"form_row"}>
                    <h4 className={"form_label"}>Link Branch (optional)</h4>
                    <Dropdown className={"form_dropdown"} button={<IconDownChevron className={"form_dropdown_icon"}/>}>
                        {this.listBranches()}
                    </Dropdown>
                </div>

                <div className={"form_row"}>
                    <h4 className={"form_label"}>Assignee (optional)</h4>
                    <Dropdown className={"form_dropdown"} button={<IconDownChevron className={"form_dropdown_icon"}/>}>
                        {this.listUsers()}
                    </Dropdown>
                </div>

                <div className={"form_row"}>
                    <h4 className={"form_label"}>Description (optional)</h4>
                    <textarea rows="6"></textarea>
                </div>
              
                <input className={"submit_button"} type="submit" value="create"></input>
            </form>
        )
    }
}

export default NewTicketForm;