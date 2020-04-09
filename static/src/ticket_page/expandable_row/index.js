import React, {Component} from 'react';
import IconChevronDown from '../../../icons/chevron_down';
import IconChevronUp from '../../../icons/chevron_up';
import './styles';

class ExpandableRow extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isOpen: this.props.isOpen || false
        }
        
    }

    toggle() {
        this.setState((prevState, props) => {
            return {isOpen: !prevState.isOpen};
        });
    }


    render() {
        return (
            <div className={"expandable_row " + (this.props.className ? this.props.className : "")}>
                <div className={"expandable_row_header"}>
                    <h2 className={"expandable_row_title"} onClick={() => this.toggle()}>
                        {this.state.isOpen && <IconChevronUp className={"expandable_row_icon"}/>}
                        {!this.state.isOpen && <IconChevronDown className={"expandable_row_icon"}/>}
                        {this.props.title}
                    </h2>
                    <span className={"expandable_row_line"}></span>
                </div>
                {this.state.isOpen && <div className={"expandable_row_content"}>
                    {this.props.children}
                </div>}
            </div>
        )
    }
}

export default ExpandableRow;