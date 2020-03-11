import React, {Component} from 'react';
import './styles';

class Dropdown extends Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            activeIndex: 0 // first el is active
        };
    }


    openDropdown() {
        // set dropdown state to open
        this.setState({
            isOpen: true
        });
    }

    closeDropdown() {
        // set dropdown state to closed
        this.setState({
            isOpen: false
        });
    }

    select(index) {
        this.setState({
            activeIndex: index,
            isOpen: false
        });
    }

    populateItems() {
        let result = [];
        let els = [];
        if (!this.props.children) return;
        els = (this.props.children && !this.props.children.length) ? [this.props.children] : this.props.children;
        for (let i = 0; i < els.length; i++) {
            result.push (
                <div className={"dropdown_el"} 
                onClick={() => this.select(i)}
                key={i}>
                    {els[i]}
                </div>
            )
        }
        return result;
    }


    render() {
        let els = [];
        els = (this.props.children && !this.props.children.length) ? [this.props.children] : this.props.children;
        
        return (
            <div className={"dropdown " + (this.props.className ? this.props.className : "")}>
                <div className={"dropdown_label"} onClick={() => this.openDropdown()}>
                    <span>{this.state.activeIndex != null ? els[this.state.activeIndex] : els[0]}</span>
                    {this.props.button || "+"}
                </div>
                {this.state.isOpen &&
                        <div className={"dropdown_content"} onClick={(e) => e.stopPropagation()}>
                            {this.populateItems()}
                        </div>

                }
                {this.state.isOpen &&
                    <div className={"dropdown_background"} onClick={() => this.closeDropdown()}>
                    </div>
                }
            </div>
        )
    }
}

export default Dropdown;