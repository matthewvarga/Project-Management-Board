import React, {Component} from 'react';
import { connect } from 'react-redux';
import {setRepoList} from "../actions/index";
import Column from "./column/index";
import Dropdown from "../dropdown/index";
import './styles';

class Board extends Component {

    constructor(props) {
        super(props);

        let mockBoardData = {
            "columns": [
                {
                    "id": 11,
                    "title": "column A",
                    "tickets": [
                        {
                            "id": 1,
                            "title": "ticket A.1"
                        },
                        {
                            "id": 2,
                            "title": "ticket A.2"
                        },
                        {
                            "id": 3,
                            "title": "ticket A.3"
                        }
                    ]
                },
                {
                    "id": 22,
                    "title": "column B",
                    "tickets": [
                        {
                            "id": 4,
                            "title": "ticket B.1"
                        },
                        {
                            "id": 5,
                            "title": "ticket B.2"
                        }
                    ]
                }
            ]
        }
        this.state = {
            board: mockBoardData,
            draggedTicketID: null,
            draggedColumnID: null
        };

        if (!this.props.repoList) this.retrieveRepos();
    }

    /**
     * retrieve a list of signed in users github repos
     */
    retrieveRepos() {
        console.log("populating repos from board component");
        fetch("http://localhost:3000/api/repos", {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
            }}).then((response) => {
                console.log("response");
                console.log(response);

                // error
                if (!response.ok) return;

                // if response is okay, read data
                response.json().then(data => {
                    console.log("data");
                    console.log(data);

                    // update store
                    this.props.setRepoList(data);
                });   
            });
    }

    /**
     * Takes the list of coloumns, and wraps them with a container for drag handling.
     * @param {*} columns 
     */
    populateColumns(columns) {
        let cols = [];
        let len = columns.length;
        for(let i = 0; i < len; i++) {
            let colID = columns[i].id;
            cols.push (
                <Column className={"board_column"} 
                    title={columns[i].title}
                    tickets={columns[i].tickets || []}
                    draggable={"true"} 
                    onDragStart={(e) => {this.colDragStart(e, colID)}}
                    onDragOver={(e) => {this.colDragOver(e, colID)}}
                    onDragEnd={(e) => {this.colDragEnd(e, colID)}}
                    onTktDragStart={(e, tktID) => {this.tktDragStart(e, tktID)}}
                    onTktDragOver={(e, tktID) => {this.tktDragOver(e, tktID)}}
                    onTktDragLeave={(e, tktID) => {this.tktDragLeave(e, tktID)}}
                    onTktDragEnd={(e, tktID) => {this.tktDragEnd(e, tktID)}}
                    key={i}>
                </Column>
            )
        }
        cols.push (
            <div className={"add_board_column"} key={len+1} onClick={() => {this.addColumn()}}>
                Add Column
            </div>
        )
        return cols;
    }

    /**
     * Fired when the column with colIndex begins to be dragged.
     * @param {*} e 
     * @param {*} colIndex - the index of the column being dragged.
     */
    colDragStart(e, colID) {
        this.setState({
            draggedColumnID: colID,
            draggedTicketID: null
        });
    }

    tktDragStart(e, tktID) {
        e.stopPropagation();
        this.setState({
            draggedColumnID: null,
            draggedTicketID: tktID
        });
    }

    /**
     * given a column id, and list containing column objects with ids,
     * returns the index of that column with the mathcing id within that list.
     * returns null if no column with the provided id exists in the list.
     * @param {*} colID - the id of the column we are trying to find
     */
    findIndexOfCol(colID) {
        for(let i = 0; i < this.state.board.columns.length; i++) {
            let col = this.state.board.columns[i];
            if(col.id == colID) {
                return i;
            }
        }
        return null;
    }

    /**
     * returns the index of the ticket with id tktID within the column
     * at the colIndex'th position in the list of baord columns
     * @param {*} colIndex - the index of the column, within the boards list of columns
     * @param {*} tktID - the id of the ticket
     */
    findIndexOfTkt(colIndex, tktID) {
        for(let i = 0; i < this.state.board.columns[colIndex].tickets.length; i++) {
            let tkt = this.state.board.columns[colIndex].tickets[i];
            if(tkt.id == tktID) {
                return i;
            }
        }
        return null;
    }

    /**
     * find the column id containing the ticket with the provided ID.
     * @param {*} tktID 
     */
    findTktColID(tktID) {
        // loop through each column
        for( let i = 0; i < this.state.board.columns.length; i++) {
            // check if ticket with provided ID is in that column
            let tkts = this.state.board.columns[i].tickets
            for(let j = 0; j < tkts.length; j++) {
                if(tkts[j].id == tktID) {
                    return this.state.board.columns[i].id;
                }
            }
        }
        return null;
    }

    /**
     * event handler for when a dragOver event is fired from a column,
     * along with the columId who is firing the event. (i.e. being
     * dragged over)
     * @param {*} e - event
     * @param {*} colID - id of the coloumn being dragged over
     */
    colDragOver(e, colID) {

        // moving ticket to column
        let tktID = this.state.draggedTicketID;
        if(tktID) {
            let tktColID = this.findTktColID(tktID);
            if(tktColID == colID) return; // ticket already in col

            let board = this.state.board;

            // remove ticket from current col
            let draggedTktColIndex = this.findIndexOfCol(this.findTktColID(tktID));
            let draggedTktIndex = this.findIndexOfTkt(draggedTktColIndex, tktID);

            let draggedColTkts = board.columns[draggedTktColIndex].tickets.slice(0, board.columns[draggedTktColIndex].tickets.length);
            let newDraggedColTkts = [];

            let ticket;

            for(let i = 0; i < draggedColTkts.length; i++) {
                if (i != draggedTktIndex) {
                    newDraggedColTkts.push(board.columns[draggedTktColIndex].tickets[i]);
                }
                else {
                    ticket = board.columns[draggedTktColIndex].tickets[i];
                }
            }
            board.columns[draggedTktColIndex].tickets = newDraggedColTkts;
            
            
            // add ticket to new col
            let hoveredColIndex = this.findIndexOfCol(colID);
            let newColTkts = board.columns[hoveredColIndex].tickets.slice(0, board.columns[hoveredColIndex].tickets.length);
            newColTkts.push(ticket);

            board.columns[hoveredColIndex].tickets = newColTkts;
            this.setState({
                board: board
            });
        }


        // moving column with another column
        let draggedColID = this.state.draggedColumnID;
        if (draggedColID == colID) return; // return since ontop of itself

        let board = this.state.board;
        let boardCols = this.state.board.columns.slice(0, this.state.board.columns.length);
        let draggedColIndex = this.findIndexOfCol(draggedColID);
        let hoveredColIndex = this.findIndexOfCol(colID);
        if (draggedColIndex == null || hoveredColIndex == null) {
            return;
        }

        // moving column to the left
        if (hoveredColIndex < draggedColIndex) {
            let newBoardCols = boardCols.slice(0, hoveredColIndex);
            newBoardCols.push(boardCols[draggedColIndex]);
            newBoardCols.push(boardCols[hoveredColIndex]);
            newBoardCols.push(...boardCols.slice(hoveredColIndex + 1, draggedColIndex))
            newBoardCols.push(...boardCols.slice(draggedColIndex+1, boardCols.length));
            board.columns = newBoardCols;
            this.setState({
                board: board
            });
        }
        // moving column to the right
        else {
            let newBoardCols = boardCols.slice(0, draggedColIndex);
            newBoardCols.push(...boardCols.slice(draggedColIndex+1, hoveredColIndex));
            newBoardCols.push(boardCols[hoveredColIndex]);
            newBoardCols.push(boardCols[draggedColIndex]);
            newBoardCols.push(...boardCols.slice(hoveredColIndex+1, boardCols.length));
            board.columns = newBoardCols;
            this.setState({
                board: board 
            });
        }
    }

    tktDragOver(e, tktID) {
        e.stopPropagation();
        e.preventDefault();

        let draggedTktID = this.state.draggedTicketID;
        if (draggedTktID == tktID) return; // return since ontop of itself

        let tktColIndex = this.findIndexOfCol(this.findTktColID(tktID));
        let draggedTktColIndex = this.findIndexOfCol(this.findTktColID(draggedTktID));
        let board = this.state.board;
        let draggedTktIndex = this.findIndexOfTkt(tktColIndex, draggedTktID);

        // tickets in diff cols
        if(tktColIndex != draggedTktColIndex) return;

        
        let boardTkts = this.state.board.columns[tktColIndex].tickets.slice(0, this.state.board.columns[tktColIndex].tickets.length);
        let hoveredTktIndex = this.findIndexOfTkt(tktColIndex, tktID);
        if (draggedTktIndex == null || hoveredTktIndex == null) {
            // console.log("unable to retrieve the column object associated with the provided id");
            return;
        }

        // moving column to the left
        if (hoveredTktIndex < draggedTktIndex) {
            let newColTkts = boardTkts.slice(0, hoveredTktIndex);
            newColTkts.push(boardTkts[draggedTktIndex]);
            newColTkts.push(boardTkts[hoveredTktIndex]);
            newColTkts.push(...boardTkts.slice(hoveredTktIndex + 1, draggedTktIndex))
            newColTkts.push(...boardTkts.slice(draggedTktIndex+1, boardTkts.length));
            board.columns[tktColIndex].tickets = newColTkts;
            // TODO: update db with the new columns
            this.setState({
                board: board
            });
        }
        // moving column to the right
        else {
            let newColTkts = boardTkts.slice(0, draggedTktIndex);
            newColTkts.push(...boardTkts.slice(draggedTktIndex+1, hoveredTktIndex));
            newColTkts.push(boardTkts[hoveredTktIndex]);
            newColTkts.push(boardTkts[draggedTktIndex]);
            newColTkts.push(...boardTkts.slice(hoveredTktIndex+1, boardTkts.length));
            board.columns[tktColIndex].tickets = newColTkts;
            // TODO: update db with the new columns
            this.setState({
                board: board
            });
        }
    }

    /**
     * prevent event propogation when leaving a ticket during drag.
     * @param {*} e 
     * @param {*} tktID 
     */
    tktDragLeave(e, tktID) {
        e.stopPropagation();
        e.preventDefault();
    }

    /**
     * Fired when a column has been released from being dragged. 
     * @param {*} e 
     * @param {*} colIndex - index of column being dragged
     */
    colDragEnd(e, colIndex) {
        if(colIndex == e.dataTransfer.getData("draggedColID")) return;
        // TODO: update db with the new column order
        this.setState({
            draggedTicketID: null,
            draggedColumnID: null
        });
    }

    /**
     * reset state to indicate no ticket is being dragged anymore
     * @param {*} e 
     * @param {*} tktID - id of ticket that has been released
     */
    tktDragEnd(e, tktID) {
        if(tktID == e.dataTransfer.getData("draggedTktID")) return;
        e.stopPropagation();
        e.preventDefault();
        this.setState({
            draggedTicketID: null,
            draggedColumnID: null
        });
    }

    addColumn() {
        console.log("add new column");
        // TODO: add new column feature
    }

    render() {
        return (
            <div className={"board"}>
                <div className={"board_header"}>
                    <h1 className={"board_title"}>{this.props.title || "Board Title"}</h1>
                </div>
                <Dropdown label={"dd"}>
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                </Dropdown>
                <div className={"board_columns"}>
                    {this.populateColumns(this.state.board.columns)}
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Board);