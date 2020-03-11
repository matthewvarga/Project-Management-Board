import React, {Component} from 'react';
import "./styles";

// https://www.flaticon.com/free-icon/arrow-down-angle_36669?term=down%20chevron&page=1&position=10
class  IconDownChevron extends Component {
    render() {
        return (
            <svg className={"icon " + (this.props.className ? this.props.className : "")}
                onClick={(e) => {this.props.onClick(e)}} version="1.1" x="0px" y="0px"
                width="30.727px" height="30.727px" viewBox="0 0 30.727 30.727">
                <g>
                    <path d="M29.994,10.183L15.363,24.812L0.733,10.184c-0.977-0.978-0.977-2.561,0-3.536c0.977-0.977,2.559-0.976,3.536,0
                        l11.095,11.093L26.461,6.647c0.977-0.976,2.559-0.976,3.535,0C30.971,7.624,30.971,9.206,29.994,10.183z"/>
                </g>
            </svg>

       
        )
    }
    
}

export default IconDownChevron;