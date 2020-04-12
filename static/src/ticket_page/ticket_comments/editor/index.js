import React, { Component, PropTypes } from 'react';
import RichTextEditor from 'react-rte';

class Editor extends Component {
    // static propTypes = {
    //   onChange: PropTypes.func
    // };

    constructor(props) {
        super(props);

        this.state = {
            value: (props.value ? RichTextEditor.createValueFromString(props.value, 'html') : RichTextEditor.createEmptyValue())
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

    reset() {
        this.setState({
            value: RichTextEditor.createEmptyValue()
        })
    }

    render() {
        return (
            <div className={"rte " + (this.props.className ? this.props.className : "")}>
                <RichTextEditor
                    readOnly={this.props.readOnly || false}
                    value={this.state.value}
                    onChange={(val) => this.onChange(val)}
                    placeholder={"Write a comment here."}
                />
            </div>
        );
    }
}

export default Editor;