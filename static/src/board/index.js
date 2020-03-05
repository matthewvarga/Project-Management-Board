import React, {Component} from 'react';
import Column from "./column/index";
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
        // e.dataTransfer.clearData();
        // e.dataTransfer.setData("draggedColID", colID);
        console.log("col " + colID + " has started being dragged");

        this.setState({
            draggedColumnID: colID,
            draggedTicketID: null
        });
    }

    tktDragStart(e, tktID) {
        console.log("tkt " + tktID + " has started being dragged");
        // let startCol = this.findTktColID(tktID);
        // e.dataTransfer.clearData();
        // e.dataTransfer.setData("tktColID", startCol);
        // e.dataTransfer.setData("draggedTktID", tktID);
        e.stopPropagation();
        // console.log("tkt started in col " + startCol);

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

    findIndexOfTkt(colIndex, tktID) {
        console.log("finding index of tktID: " + tktID + " in column " + colIndex);
        console.log(this.state.board.columns[colIndex]);
        for(let i = 0; i < this.state.board.columns[colIndex].tickets.length; i++) {
            let tkt = this.state.board.columns[colIndex].tickets[i];
            console.log(tkt);
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

        // let draggedColID = e.dataTransfer.getData("draggedColID");
        // let draggedTktID = e.dataTransfer.getData("draggedTktID");
        // let draggedTktColID = e.dataTransfer.getData("tktColID");

        // let draggedTktID = this.state.draggedTicketID;

        // console.log("ticket id: ", draggedTktID);
        // // console.log("ticket origin col id: ", draggedTktColID);

        // // ticket being dragged into this column
        // if (this.state.draggedTicketID) {
        //     // ticket in originating column
        //     let startColID = this.findTktColID(draggedTktID);

        //     console.log("start col id: ");
        //     if (startColID == colID || startColID == null) return;
        //     else {
        //         // ticket is in new column
        //         console.log("ticket in new column");

        //         // remove it from current col and add to new one
        //         let board = this.state.board;
        //         let originColIndex = this.findIndexOfCol(startColID);

               

        //         console.log("original column index: " + originColIndex);
        //         let currentColIndex = this.findIndexOfCol(colID);
        //         let originTktIndex = this.findIndexOfTkt(originColIndex, draggedTktID);


        //         console.log("index of tkt in origin col: ", originTktIndex);

        //         let tkt = board.columns[originColIndex].tickets[originTktIndex];
        //         console.log("tkt ");
        //         console.log(tkt);

        //         let newTkts1 = [];
        //         for (let i = 0; i < board.columns[originColIndex].tickets.length; i++) {
        //             if (i != originTktIndex) {
        //                 newTkts1.push(board.columns[originColIndex].tickets[i]);
        //             }
        //         }
        //         let newTkts2 = [];
        //         for (let j = 0; j < board.columns[currentColIndex].tickets.length; j++) {
        //             newTkts2.push(board.columns[currentColIndex].tickets[j]);
        //         }
        //         newTkts2.push(tkt);
                
        //         console.log("new");
        //         console.log(newTkts1);
        //         console.log("old");
        //         console.log(newTkts2);

        //         // board.columns[originColIndex].tickets = newTkts1;
        //         board.columns[currentColIndex].tickets = newTkts2;

        //         console.log(board);

        //         // e.dataTransfer.clearData();
        //         // e.dataTransfer.setData("tktColID", colID);
        //         // e.dataTransfer.setData("draggedTktID", draggedTktID);


        //         this.setState({
        //             board: board,
        //             draggedTicketID: draggedTktID,
        //             draggedColumnID: colID
        //         });
        //     }
        //     return;
        // }

        let draggedColID = this.state.draggedColumnID;
        if (draggedColID == colID) return; // return since ontop of itself
        console.log("col " + colID + " is being dragged over");

        let board = this.state.board;
        let boardCols = this.state.board.columns.slice(0, this.state.board.columns.length);
        let draggedColIndex = this.findIndexOfCol(draggedColID)
        let hoveredColIndex = this.findIndexOfCol(colID);
        if (draggedColIndex == null || hoveredColIndex == null) {
            // console.log("unable to retrieve the column object associated with the provided id");
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
        // console.log("tkt " + tktID + " is being dragged over");
        e.stopPropagation();
        e.preventDefault();

        // let draggedTktID = this.state.draggedTicketID;
        // let startColID = this.findTktColID(draggedTktID);
        // let curColID = this.findTktColID(tktID);

        // // if over a ticket in another column
        // if(startColID != curColID) return;


        // let board = this.state.board;
       
        // let draggedColIndex = this.findIndexOfCol(startColID)
        // let hoveredColIndex = this.findIndexOfCol(curColID);
        // if (draggedColIndex == null || hoveredColIndex == null) {
        //     // console.log("unable to retrieve the column object associated with the provided id");
        //     return;
        // }

        // let draggedTktIndex = this.findIndexOfTkt(draggedColIndex, draggedTktID);
        // let hoveredTktIndex = this.findIndexOfTkt(draggedColIndex, tktID);
        // if (draggedTktIndex == null || hoveredTktIndex == null) {
        //     // console.log("unable to retrieve the column object associated with the provided id");
        //     return;
        // }

        // let colTkts = this.state.board.columns[hoveredColIndex].tickets.slice(0, this.state.board.columns.length);
        

        // // moving column to the left
        // if (hoveredTktIndex < draggedTktIndex) {
        //     let newColTkts = colTkts.slice(0, hoveredTktIndex);
        //     newColTkts.push(colTkts[draggedTktIndex]);
        //     newColTkts.push(colTkts[hoveredTktIndex]);
        //     newColTkts.push(...colTkts.slice(hoveredTktIndex + 1, draggedTktIndex))
        //     newColTkts.push(...colTkts.slice(draggedTktIndex+1, colTkts.length));
        //     board.columns[draggedColIndex].tickets = newColTkts;
        //     this.setState({
        //         board: board
        //     });
        // }
        // // moving column to the right
        // else {
        //     let newColTkts = colTkts.slice(0, draggedTktIndex);
        //     newColTkts.push(...colTkts.slice(draggedTktIndex+1, hoveredTktIndex));
        //     newColTkts.push(colTkts[hoveredTktIndex]);
        //     newColTkts.push(colTkts[draggedTktIndex]);
        //     newColTkts.push(...colTkts.slice(hoveredTktIndex+1, colTkts.length));
        //     board.columns[draggedColIndex].tickets = newColTkts;
        //     this.setState({
        //         board: board 
        //     });
        // }

        let draggedTktID = this.state.draggedTicketID;
        if (draggedTktID == tktID) return; // return since ontop of itself
        console.log("tkt " + tktID + " is being dragged over");


        let tktColIndex = this.findIndexOfCol(this.findTktColID(tktID));
        let draggedTktColIndex = this.findIndexOfCol(this.findTktColID(draggedTktID));

        if(tktColIndex != draggedTktColIndex) return; // tickets in diff cols

        let board = this.state.board;
        let boardTkts = this.state.board.columns[tktColIndex].tickets.slice(0, this.state.board.columns[tktColIndex].tickets.length);

        let draggedTktIndex = this.findIndexOfTkt(tktColIndex, draggedTktID)
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
            this.setState({
                board: board
            });
        }
        
    }

    tktDragLeave(e, tktID) {
        // console.log("leaving ticket " + tktID);
        e.stopPropagation();
        e.preventDefault();
    }

    /**
     * Fired when a column has been released from being dragged. 
     * @param {*} e 
     * @param {*} colIndex 
     */
    colDragEnd(e, colIndex) {
        if(colIndex == e.dataTransfer.getData("draggedColID")) return; // no change
        // console.log("the column in position: " + colIndex + " was poved to position: " + e.dataTransfer.getData("draggedColID"));
        // TODO: update db with the new column order
        this.setState({
            draggedTicketID: null,
            draggedColumnID: null
        });
    }

    tktDragEnd(e, tktID) {
        if(tktID == e.dataTransfer.getData("draggedTktID")) return; // no change
        // console.log("the tkt : " + tktID + " was poved to position: " + e.dataTransfer.getData("draggedColID"));
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
                <div className={"board_columns"}>
                    {this.populateColumns(this.state.board.columns)}
                </div>
            </div>
        )
    }
}

export default Board;