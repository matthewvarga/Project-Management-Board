import React, {Component} from 'react';
import './styles';

class Board extends Component {

    constructor(props) {
        super(props);

        this.state = {
            columns: (props.children && props.children.length) ? props.children: [],
            selectedColIndex: null
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
            cols.push (
                <div className={"board_column"} 
                     draggable={"true"} 
                     onDragStart={(e) => this.dragStart(e, i)}
                     onDragOver={(e) => {this.dragOver(e, i)}}
                     onDragEnd={(e) => {this.dragEnd(e, i)}}
                     onDrop={(e) => {this.dragDrop(e, i)}}
                     key={i}
                     data-board-column-index={i}>
                    {columns[i]}
                </div>
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
    dragStart(e, colIndex) {
        //console.log("col has started being dragged: ", colIndex);
        this.setState({
            selectedColIndex: colIndex
        });
    }

    /**
     * Fired when a column is having another column dragged above it.
     * @param {*} e 
     * @param {*} colIndex - The index of the column being dragged above it.
     */
    dragOver(e, colIndex) {
        if(colIndex == this.state.selectedColIndex) return;

        let oldCols = this.state.columns.slice(0, this.state.columns.length);
        let selectedColumn = oldCols[this.state.selectedColIndex];
        let droppedColumn = oldCols[colIndex];

        // moving column to the left
        if (colIndex < this.state.selectedColIndex) {
            let newCols = oldCols.slice(0, colIndex);
            newCols.push(selectedColumn);
            newCols.push(droppedColumn);
            newCols.push(...oldCols.slice(colIndex + 1, this.state.selectedColIndex))
            newCols.push(...oldCols.slice(this.state.selectedColIndex+1, oldCols.length));
            this.setState({
                selectedColIndex: colIndex,
                columns: newCols
            });
        }
        // moving column to the right
        else {
            let newCols = oldCols.slice(0, this.state.selectedColIndex);
            newCols.push(...oldCols.slice(this.state.selectedColIndex + 1, colIndex));
            newCols.push(droppedColumn);
            newCols.push(selectedColumn);
            newCols.push(...oldCols.slice(colIndex + 1, oldCols.length));
            this.setState({
                selectedColIndex: colIndex,
                columns: newCols
            });
        }
    }

    /**
     * Fired when a column has been released from being dragged. 
     * @param {*} e 
     * @param {*} colIndex 
     */
    dragEnd(e, colIndex) {
        if(colIndex == this.state.selectedColIndex) return;
        console.log("the column in position: " + colIndex + " was poved to position: " + this.state.selectedColIndex);

        // TODO: update db with the changes
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
                    {this.populateColumns(this.state.columns)}
                </div>
            </div>
        )
    }
}

export default Board;