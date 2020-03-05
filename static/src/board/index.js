import React, {Component} from 'react';
import Column from "../column/index";
import './styles';

class Board extends Component {

    constructor(props) {
        super(props);

        let mockBoardData = {
            "columns": [
                {
                    "id": 1,
                    "title": "col A",
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
                    "title": "col B",
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
        //console.log("col has started being dragged: ", colIndex);
        // this.setState({
        //     selectedColIndex: colIndex
        // });
        e.dataTransfer.setData("draggedColID", colID);
        console.log("col " + colID + " has started being dragged");
    }

    colDragOver(e, colID) {
        let draggedColID = e.dataTransfer.getData("draggedColID");
        if (draggedColID == colID) return; // return since ontop of itself
        console.log("col " + colID + " is being dragged over");


    }

    // /**
    //  * Fired when a column is having another column dragged above it.
    //  * @param {*} e 
    //  * @param {*} colIndex - The index of the column being dragged above it.
    //  */
    // dragOver(e, colIndex) {
    //     if(colIndex == this.state.selectedColIndex) return;

    //     let oldCols = this.state.columns.slice(0, this.state.columns.length);
    //     let selectedColumn = oldCols[this.state.selectedColIndex];
    //     let droppedColumn = oldCols[colIndex];

    //     // moving column to the left
    //     if (colIndex < this.state.selectedColIndex) {
    //         let newCols = oldCols.slice(0, colIndex);
    //         newCols.push(selectedColumn);
    //         newCols.push(droppedColumn);
    //         newCols.push(...oldCols.slice(colIndex + 1, this.state.selectedColIndex))
    //         newCols.push(...oldCols.slice(this.state.selectedColIndex+1, oldCols.length));
    //         this.setState({
    //             selectedColIndex: colIndex,
    //             columns: newCols
    //         });
    //     }
    //     // moving column to the right
    //     else {
    //         let newCols = oldCols.slice(0, this.state.selectedColIndex);
    //         newCols.push(...oldCols.slice(this.state.selectedColIndex + 1, colIndex));
    //         newCols.push(droppedColumn);
    //         newCols.push(selectedColumn);
    //         newCols.push(...oldCols.slice(colIndex + 1, oldCols.length));
    //         this.setState({
    //             selectedColIndex: colIndex,
    //             columns: newCols
    //         });
    //     }
    // }

    // /**
    //  * Fired when a column has been released from being dragged. 
    //  * @param {*} e 
    //  * @param {*} colIndex 
    //  */
    // dragEnd(e, colIndex) {
    //     if(colIndex == this.state.selectedColIndex) return;
    //     console.log("the column in position: " + colIndex + " was poved to position: " + this.state.selectedColIndex);

    //     // TODO: update db with the changes
    // }

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