import React, {Component} from 'react';
import Column from "./column/index";
import './styles';

class Board extends Component {

    constructor(props) {
        super(props);

        let mockBoardData = {
            "columns": [
                {
                    "id": 1,
                    "title": "column A",
                    "tickets": [
                        {
                            "id": 1,
                            "title": "ticket 1"
                        },
                        {
                            "id": 2,
                            "title": "ticket 1"
                        },
                        {
                            "id": 3,
                            "title": "ticket 1"
                        }
                    ]
                },
                {
                    "id": 2,
                    "title": "column B",
                    "tickets": [
                        {
                            "id": 1,
                            "title": "ticket 1"
                        },
                        {
                            "id": 2,
                            "title": "ticket 1"
                        }
                    ]
                }
            ]
        }
        this.state = {
            board: mockBoardData
        };
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
                    tickets={columns[i].tickets}
                    draggable={"true"} 
                    onDragStart={(e) => this.colDragStart(e, colID)}
                    onDragOver={(e) => {this.colDragOver(e, colID)}}
                    onDragEnd={(e) => {this.colDragEnd(e, colID)}}
                    key={i}>
                </Column>
            )
        }
        cols.push (
            <div className={"add_board_column"} key={len+1} onClick={() => this.addColumn()}>
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
        e.dataTransfer.setData("draggedColID", colID);
        // console.log("col " + colID + " has started being dragged");
    }

    /**
     * given a column id, and list containing column objects with ids,
     * returns the index of that column with the mathcing id within that list.
     * returns null if no column with the provided id exists in the list.
     * @param {*} colsList - list of columns we are searching in
     * @param {*} colID - the id of the column we are trying to find
     */
    findIndexOfCol(colsList, colID) {
        for(let i = 0; i < colsList.length; i++) {
            let col = colsList[i];
            if(col.id == colID) {
                return i;
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
        let draggedColID = e.dataTransfer.getData("draggedColID");
        if (draggedColID == colID) return; // return since ontop of itself
        // console.log("col " + colID + " is being dragged over");

        let board = this.state.board;
        let boardCols = this.state.board.columns.slice(0, this.state.board.columns.length);
        let draggedColIndex = this.findIndexOfCol(boardCols, draggedColID)
        let hoveredColIndex = this.findIndexOfCol(boardCols, colID);
        if (draggedColIndex == null || hoveredColIndex == null) {
            console.log("unable to retrieve the column object associated with the provided id");
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


    /**
     * Fired when a column has been released from being dragged. 
     * @param {*} e 
     * @param {*} colIndex 
     */
    colDragEnd(e, colIndex) {
        if(colIndex == e.dataTransfer.getData("draggedColID")) return; // no change
        // console.log("the column in position: " + colIndex + " was poved to position: " + this.state.selectedColIndex);
        // TODO: update db with the new column order
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
                <div className={"board_columns"}>
                    {this.populateColumns(this.state.board.columns)}
                </div>
            </div>
        )
    }
}

export default Board;