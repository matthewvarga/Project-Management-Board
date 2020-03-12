import React, {Component} from 'react';
import './styles';

class Dropdown extends Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            activeIndex: props.activeIndex || 0, // first el is active
            disabled: props.disabled || false
        };
    }

    componentDidUpdate(prevProps, prevState) {
        // deep prop changes dont propogate to force statechange,
        // so have to manually check and update
        console.log("dropdown props changed");
        if(prevProps != this.props || prevProps.children != this.props.children) {
            console.log("old children length: " + prevProps.children.length);
            console.log("new children length: " + this.props.children.length);
            this.setState({
                activeIndex: this.props.activeIndex != undefined ? this.props.activeIndex : prevProps.activeIndex,
                disabled: this.props.disabled
            });
        }
    }

    openDropdown() {
        if(this.state.disabled) return;
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

    select(e, index) {
        this.props.onSelectItem(e, index)
        this.setState({
            activeIndex: index,
            isOpen: false
        });
    }

    populateItems() {
        let result = [];
        let els = [];
        if (!this.props.children) return [];
        els = (this.props.children && !this.props.children.length) ? [this.props.children] : this.props.children;
        for (let i = 0; i < els.length; i++) {
            result.push (
                <div className={"dropdown_el " + ((this.state.activeIndex == i) ? "active ": "")} 
                    onClick={(e) => this.select(e, i)}
                    key={i}>
                    {els[i]}
                </div>
            )
        }
        return result;
    }


    render() {
        let els = [];
        if (this.props.children) {
            els = (!this.props.children.length) ? [this.props.children] : this.props.children;
        }

        
        return (
            <div className={"dropdown " + (this.state.disabled ? " disabled " : "") + (this.props.className ? this.props.className : "")}>
                <div className={"dropdown_title_row"} onClick={() => this.openDropdown()}>
                    <span className={"dropdown_label"}>{this.state.activeIndex != null ? els[this.state.activeIndex] : els[0]}</span>
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