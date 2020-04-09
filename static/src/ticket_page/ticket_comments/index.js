import React, {Component} from 'react';
import Editor from './editor/index';
import './styles';

class TicketComments extends Component {

    constructor(props) {
        super(props);

        this.comment = "";
    }

    updateCommentValue(value) {
        this.comment = value;
    }

    submit() {
        console.log(this.comment.toString('html'));
    }

    render() {
        return (
            <div className={"ticket_comments " + (this.props.className ? this.props.className : "")} >
                <div className={"ticket_comments_rte_row"}>
                    <div className={"ticket_comments_user_image"}></div>
                    <Editor onChange={(value) => this.updateCommentValue(value)} className={"ticket_comments_rte"}/>
                </div>
                <div className={"ticket_comments_btn_row"}>
                    <span className={"ticket_comments_btn"} onClick={() => this.submit()}>
                        Comment
                    </span>
                </div>
            </div>
        )
    }
}


export default TicketComments;