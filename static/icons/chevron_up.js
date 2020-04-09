import React, { Component } from 'react';

// https://www.flaticon.com/free-icon/up-arrow_748030
class IconChevronUp extends Component {
    render() {
        return (
            <svg className={(this.props.className? this.props.className:"")} version="1.1" x="0px" y="0px" viewBox="0 0 512 512">
                <path d="M506.127,351.331l-207.701-207.27c-23.393-23.394-61.458-23.395-84.838-0.015L5.872,351.33
                c-7.818,7.802-7.831,20.465-0.029,28.284c7.802,7.818,20.465,7.832,28.284,0.029l207.731-207.299
                c7.798-7.797,20.486-7.798,28.299,0.015l207.716,207.285c3.904,3.896,9.015,5.843,14.127,5.843c5.125,0,10.25-1.958,14.156-5.872
                C513.959,371.796,513.945,359.133,506.127,351.331z"/>
            </svg>
        );
    }
}

export default IconChevronUp;