
import React, { Component } from 'react';

// https://www.flaticon.com/free-icon/down-arrow_748063
class IconChevronDown extends Component {
    render() {
        return (
            <svg className={(this.props.className? this.props.className:"")} version="1.1" x="0px" y="0px" viewBox="0 0 512 512">
                <path d="M506.157,132.386c-7.803-7.819-20.465-7.831-28.285-0.029l-207.73,207.299c-7.799,7.798-20.486,7.797-28.299-0.015
                    L34.128,132.357c-7.819-7.803-20.481-7.79-28.285,0.029c-7.802,7.819-7.789,20.482,0.029,28.284l207.701,207.27
                    c11.701,11.699,27.066,17.547,42.433,17.547c15.358,0,30.719-5.846,42.405-17.533L506.128,160.67
                    C513.946,152.868,513.959,140.205,506.157,132.386z"/>
            </svg>
        );
    }
}

export default IconChevronDown;