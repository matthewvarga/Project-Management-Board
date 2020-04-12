import React, {Component} from 'react';
import Editor from './editor/index';
import './styles';

class TicketComments extends Component {

    constructor(props) {
        super(props);


        this.comment = "";
        this.editorRef = React.createRef();

        this.state = {
            comments: props.comments || []
        };

    }

    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(prevProps.comments) != JSON.stringify(this.props.comments)) {
            this.setState({
                comments: this.props.comments
            });
        }
    }

    updateCommentValue(value) {
        this.comment = value;
    }

    submit() {
        this.props.onComment(this.comment.toString('html'));
        this.editorRef.current.reset();
    }

    populateComments(comments) {
        let coms = [];
        if (!comments) return [];
        for (let i = 0; i < comments.length; i++) {
            coms.push(
                <div className={"ticket_comments_comment_container"}>
                    <span className={"ticket_comments_comment_author"}>{comments[i].author} commented:</span>
                    <Editor value={comments[i].msg} readOnly={true}/>
                </div>
                
            )
        }
        return coms;
    }

    render() {
        return (
            <div className={"ticket_comments " + (this.props.className ? this.props.className : "")} >
                {this.populateComments(this.props.comments)}
                <h3>Leave a new comment:</h3>
                <div className={"ticket_comments_rte_row"}>
                    {/* <div className={"ticket_comments_user_image"}></div> */}
                    <Editor ref={this.editorRef} onChange={(value) => this.updateCommentValue(value)} className={"ticket_comments_rte"}/>
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