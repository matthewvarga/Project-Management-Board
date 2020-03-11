import React, {Component} from 'react';
import { connect } from 'react-redux';
import {setRepoList} from "../../actions/index";
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
            "None",
            "Create New Branch",
            "Branch 1", 
            "Branch 2",
            "Branch 3"
        ];

        this.mockAssigneeData = [
            "None",
            "matthew",
            "abi",
            "johnson"
        ];

        this.state = {
            activePage: 0,
            selectedRepoIndex: 0,
            selectedBranchIndex: 0,
            selectedSourceBranchIndex: 0,
            selectedAssigneeIndex: 0
        };
    }

    listRepos() {
        let els = ["None"];
        if (!this.props.repoList) return els;
        for(let i = 0; i < this.props.repoList.length; i++) {
            els.push(this.props.repoList[i].full_name);
        }
        return els;
    }

    createTicket(e) {
        e.preventDefault();

        console.log("submit");
    }

    // TODO: retrieve list from server
    // listRepos() {
    
    //     //http://localhost:3000/api/repos 
    //     // let repos = [];
    //     // for (let i = 0; i < this.state.repoList.length; i++) {
    //     //     repos.push(
    //     //         <p>{this.state.repoList[i]}</p>
    //     //     )
    //     // }
    //     return this.state.repoList;
    // }

    listBranches() {
        return this.mockBranchData;
    }

    listUsers() {
        return this.mockAssigneeData;
    }

    selectRepo(e, i) {
        let branchIndex = this.state.selectedBranchIndex;
        let sourceIndex = this.state.selectedSourceBranchIndex;
        let assigneeIndex = this.state.selectedAssigneeIndex;
        this.setState({
            selectedRepoIndex: i,
            selectedBranchIndex: (i == 0) ? 0: branchIndex,
            selectedSourceBranchIndex: (i == 0) ? 0: sourceIndex,
            selectedAssigneeIndex: (i == 0) ? 0: assigneeIndex
        });
    }

    selectBranch(e, i) {
        let sourceIndex = this.state.selectedSourceBranchIndex;
        this.setState({
            selectedBranchIndex: i,
            selectedSourceBranchIndex: (i != 1) ? 0: sourceIndex,
        });
    }

    selectAsignee(e, i) {
        console.log("select assignee");
    }

    nextPage(e) {
        this.setState({
            activePage: 1
        });
    }

    prevPage(e) {
        this.setState({
            activePage: 0
        });
    }

    render() {
        return (
            <form className={"new_ticket_form"} onSubmit={this.createTicket.bind(this)}>

                {/* PAGE ONE */}
                {this.state.activePage == 0 &&
                <div className={"form_page"}>
                    {/* title row */}
                    <div className={"form_row"}>
                        <h4 className={"form_label"}>Title</h4>
                        <input  ref={"ticket_title"} type="text" name="ticket_title" placeholder="" />
                    </div>

                    {/* repository selection */}
                    <div className={"form_row"}>
                        <h4 className={"form_label"}>Link Repository (optional)</h4>
                        <Dropdown className={"form_dropdown"} 
                            button={<IconDownChevron className={"form_dropdown_icon"}/>}
                            disabled={false}
                            onSelectItem={(e, i) => this.selectRepo(e, i)}
                            activeIndex={this.state.selectedRepoIndex}>
                            {this.listRepos()}
                        </Dropdown>
                    </div>
                    
                    {/* branch selection */}
                    <div className={"form_row"}>
                        <h4 className={"form_label"}>Link Branch (optional)</h4>
                        <Dropdown className={"form_dropdown"} 
                            button={<IconDownChevron className={"form_dropdown_icon"}/>}
                            disabled={this.state.selectedRepoIndex == 0}
                            onSelectItem={(e, i) => this.selectBranch(e, i)}
                            activeIndex={this.state.selectedBranchIndex}>
                            {this.listBranches()}
                        </Dropdown>
                    </div>

                    {/* create new branch */}
                    <div className={"new_branch_section " + (this.state.selectedBranchIndex != 1 ? "disabled " : "")}>
                        {/* source branch */}
                        <div className={"form_row"}>
                            <h4 className={"form_label"}>Source Branch</h4>
                            <Dropdown className={"form_dropdown"} 
                                button={<IconDownChevron className={"form_dropdown_icon"}/>}
                                disabled={this.state.selectedBranchIndex != 1}
                                onSelectItem={(e, i) => {}}
                                activeIndex={0}>
                                {this.listBranches()}
                            </Dropdown>
                        </div>

                        {/* target branch */}
                        <div className={"form_row"}>
                            <h4 className={"form_label"}>New Branch Name</h4>
                            <input  ref={"branch_title"} type="text" name="branch_title" placeholder="" />
                        </div>
                    </div>

                    <div className={"bottom-row"}>
                        <div className={"pagination"}>
                            <span className={"pagination-full"}></span>
                            <span className={"pagination-empty"} onClick={() => this.nextPage()}></span>
                        </div>
                        
                        <input className={"next_button"} type="button" value="next" onClick={(e) => this.nextPage()}></input>
                    </div>
                    
                </div>
                }
                
                {/* PAGE Two */}
                {this.state.activePage == 1 &&
                <div className={"form_page"}>
                    <div className={"form_row"}>
                        <h4 className={"form_label"}>Assignee (optional)</h4>
                        <Dropdown className={"form_dropdown"} 
                            button={<IconDownChevron className={"form_dropdown_icon"}/>}
                            disabled={this.state.selectedRepoIndex == 0}
                            onSelectItem={(e, i) => this.selectAsignee()}
                            activeIndex={this.state.selectedAssigneeIndex}>
                            {this.listUsers()}
                        </Dropdown>
                    </div>

                    <div className={"form_row"}>
                        <h4 className={"form_label"}>Description (optional)</h4>
                        <textarea rows="6"></textarea>
                    </div>

                    <div className={"form_row_horizontal"}>
                        <h4 className={"form_label"}>Story Points (optional)</h4>
                        <input className={"story_points"} type="text"></input>
                    </div>

                    <div className={"bottom-row"}>
                        <div className={"pagination"}>
                            <span className={"pagination-empty"} onClick={() => this.prevPage()}></span>
                            <span className={"pagination-full"}></span>
                        </div>

                        <input className={"submit_button"} type="submit" value="create"></input>
                    </div>
                </div>
                }
                
            </form>
        )
    }
}

// redux
const mapStateToProps = (state, ownProps) => ({
	repoList: state.repoList
});

// dispach 
const mapDispatchToProps = dispatch => ({
    setRepoList: repoList => dispatch(setRepoList(repoList))
});

export default connect(mapStateToProps, mapDispatchToProps)(NewTicketForm);