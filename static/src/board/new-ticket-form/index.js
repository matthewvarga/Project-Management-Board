import React, {Component} from 'react';
import { connect } from 'react-redux';
import {setRepoList, setBoard} from "../../actions/index";
import Dropdown from "../../dropdown/index";
import IconDownChevron from "../../../icons/downChevron";
import './styles';

class NewTicketForm extends Component {

    constructor(props) {
        super(props);

        this.titleRef = React.createRef();
        this.repoRef = React.createRef();
        this.linkBranchRef = React.createRef();
        this.sourceBranchRef = React.createRef();
        this.newBranchRefRef = React.createRef();
        this.assigneeRef = React.createRef();
        this.descRef = React.createRef();
        this.pointsRef = React.createRef();


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

        let title = this.titleRef.current.value;
        let repo = this.repoRef.current.getValue();
        let linkBranch = this.linkBranchRef.current.getValue();
        let sourceBranch = this.sourceBranchRef.current.getValue();
        let newBranch = this.newBranchRefRef.current.value;
        let assignee = this.assigneeRef.current.getValue();
        let description = this.descRef.current.value;
        let points = parseInt(this.pointsRef.current.value);

        // console.log("title: " + title);
        // console.log("repo: " + repo);
        // console.log("link branch: " + linkBranch);
        // console.log("source branch: " + sourceBranch);
        // console.log("new branch: " + newBranch);
        // console.log("assignee: " + assignee);
        // console.log("desc: " + description);
        // console.log("points: " + points);

        // title is only required field
        // TODO: more input verification
        if (!title) return;

        fetch("https://project-management.tools/api/boards/" + this.props.board.id +"/columns/" + this.props.colID +"/tickets/", {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "title": title,
                "description": description,
                "assignee": assignee,
                "points": points
            })
        }).then((response) => {
            // error
            if (!response.ok) return;

            // if response is okay, read data
            response.json().then(data => {

                // propogate to close modal
                this.props.onSubmitTicket();

                this.props.setBoard(data)
            });   
        });
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
        fetch("https://project-management.tools/api/repos/branches", {
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

            console.log(response);
            // error
            if (!response.ok) return;

            // if response is okay, read data
            response.json().then(data => {

                console.log(data);
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
        fetch("https://project-management.tools/api/repos/users", {
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
        // console.log("select assignee");
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
                <div className={"form_page " + (this.state.activePage == 0 ? "" : " hidden")}>
                    {/* title row */}
                    <div className={"form_row"}>
                        <h4 className={"form_label"}>Title</h4>
                        <input ref={this.titleRef} type="text" name="ticket_title" placeholder="" />
                    </div>

                    {/* repository selection */}
                    <div className={"form_row"}>
                        <h4 className={"form_label"}>Link Repository (optional)</h4>
                        <Dropdown ref={this.repoRef} className={"form_dropdown"} 
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
                        <Dropdown ref={this.linkBranchRef} className={"form_dropdown"} 
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
                            <Dropdown ref={this.sourceBranchRef} className={"form_dropdown"} 
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
                            <input  ref={this.newBranchRefRef} type="text" name="branch_title" placeholder="" />
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

                {/* PAGE Two */}
                <div className={"form_page " + (this.state.activePage == 1 ? "" : " hidden")}>
                    <div className={"form_row"}>
                        <h4 className={"form_label"}>Assignee (optional)</h4>
                        <Dropdown ref={this.assigneeRef} className={"form_dropdown"} 
                            button={<IconDownChevron className={"form_dropdown_icon"}/>}
                            disabled={this.state.selectedRepoIndex == 0}
                            onSelectItem={(e, i) => this.selectAsignee()}
                            activeIndex={this.state.selectedAssigneeIndex}>
                            {this.state.contributers}
                        </Dropdown>
                    </div>

                    <div className={"form_row"}>
                        <h4 className={"form_label"}>Description (optional)</h4>
                        <textarea ref={this.descRef} rows="6"></textarea>
                    </div>

                    <div className={"form_row_horizontal"}>
                        <h4 className={"form_label"}>Story Points (optional)</h4>
                        <input ref={this.pointsRef} className={"story_points"} type="text"></input>
                    </div>

                    <div className={"bottom-row"}>
                        <div className={"pagination"}>
                            <span className={"pagination-empty"} onClick={() => this.prevPage()}></span>
                            <span className={"pagination-full"}></span>
                        </div>

                        <input className={"submit_button"} type="submit" value="create"></input>
                    </div>
                </div>        
            </form>
        )
    }
}

// redux
const mapStateToProps = (state, ownProps) => ({
    repoList: state.repoList,
    board: state.board
});

// dispach 
const mapDispatchToProps = dispatch => ({
    setRepoList: repoList => dispatch(setRepoList(repoList)),
    setBoard: board => dispatch(setBoard(board))
});

export default connect(mapStateToProps, mapDispatchToProps)(NewTicketForm);