import React, {Component} from 'react';
import { connect } from 'react-redux';
import {setRepoList} from "../../actions/index";
import Dropdown from "../../dropdown/index";
import IconDownChevron from "../../../icons/downChevron";
import './styles';

class NewTicketForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activePage: 0,
            selectedRepoIndex: 0,
            selectedBranchIndex: 0,
            selectedSourceBranchIndex: 0,
            selectedAssigneeIndex: 0,
            linkBranches: ["None"],
            sourceBranches: [],
            contributers: ["None"]
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

    /**
     * event handler for when user selects a repository from teh dropdown.
     * If the option selected is a valid repository, it queries the endpoint to 
     * retrieve a list of branches associated with the repository.
     * @param {*} e - event
     * @param {*} i - index of the selected repository within the dropdown
     */
    selectRepo(e, i) {
        // retrieve list of branches for the repo
        if(i > 0) {
            // minus 1 since we prepend "None" in dropdown
            let repo = this.props.repoList[i-1].name;
            let owner = this.props.repoList[i-1].owner.login;
            this.retrieveBranches(repo, owner);
            this.retrieveContributers(repo, owner);
        }
        
        this.setState({
            selectedRepoIndex: i,
            selectedBranchIndex: 0,
            selectedSourceBranchIndex: 0,
            selectedAssigneeIndex: 0
        });
    }

    /**
     * provided a repository name and owner, it retrieves a list of
     * associated branches for that repository, and updates the state.
     * @param {*} repo - repository name
     * @param {*} owner - owner name
     */
    retrieveBranches(repo, owner) {
        fetch("http://localhost:3000/api/repos/branches", {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                repo: repo,
                owner: owner
            })
        }).then((response) => {
            // error
            if (!response.ok) return;

            // if response is okay, read data
            response.json().then(data => {
                let repoBranches = ["None", "Create New Branch"];
                for (let i = 0; i < data.length; i++) {
                    repoBranches.push(data[i].name);
                }
                let sourceBranches = repoBranches.slice(2, repoBranches.length);

                this.setState({
                    linkBranches: repoBranches,
                    sourceBranches: sourceBranches
                });
            });   
        });
    }

    /**
     * provided a repository name and owner, it retrieves a list of
     * contributers for that repository, and updates the state.
     * @param {*} repo - repository name
     * @param {*} owner - owner name
     */
    retrieveContributers(repo, owner) {
        fetch("http://localhost:3000/api/repos/users", {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                repo: repo,
                owner: owner
            })
        }).then((response) => {
            // error
            if (!response.ok) return;

            // if response is okay, read data
            response.json().then(data => {
                let contributers = ["None"];
                for (let i = 0; i < data.length; i++) {
                    contributers.push(data[i].login);
                }

                this.setState({
                    contributers: contributers
                });
            });   
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
                            {this.state.linkBranches}
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
                                {this.state.sourceBranches}
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
                            {this.state.contributers}
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