import React, {Component} from 'react';
import './styles';

class Board extends Component {

    constructor(props) {
        super(props);
    }


    dragStart(e) {
        console.log("col has started being dragged");
    }

    dragOver(e) {
        console.log("col is being dragged over");
    }

    dragDrop(e) {
        console.log("col has been dropped onto another col");
    }

    addColumn() {
        console.log("add new column");
    }


    populateColumns() {
        if(!this.props.children || !this.props.children.length) {
            return null;
        }
        let cols = [];
        let len = this.props.children.length;
        for(let i = 0; i < len; i++) {
            cols.push (
                <div className={"board_column"} 
                     draggable={"true"} 
                     onDragStart={(e) => this.dragStart(e)}
                     onDragOver={(e) => {this.dragOver(e)}}
                     onDrop={(e) => this.dragDrop(e)}
                     key={i}>
                    {this.props.children[i]}
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

    render() {
        return (
            <div className={"board"}>
                <div className={"board_header"}>
                    <h1 className={"board_title"}>{this.props.title || "Board Title"}</h1>
                </div>
                <div className={"board_columns"}>
                    {this.populateColumns()}
                </div>
            </div>
        )
    }
}

export default Board;