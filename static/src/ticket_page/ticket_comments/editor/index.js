import React, { Component, PropTypes } from 'react';
import RichTextEditor from 'react-rte';

class Editor extends Component {
    // static propTypes = {
    //   onChange: PropTypes.func
    // };

    constructor(props) {
        super(props);

        this.state = {
            value: RichTextEditor.createEmptyValue()
        }
    }


    onChange(val) {
        if (this.props.onChange) {
            this.props.onChange(val);
        }

        this.setState({ 
            value: val
        });
        
    }

    render() {
        return (
            <div className={"rte " + (this.props.className ? this.props.className : "")}>
                <RichTextEditor
                    value={this.state.value}
                    onChange={(val) => this.onChange(val)}
                    placeholder={"Write a comment here."}
                />
            </div>
        );
    }
}

export default Editor;