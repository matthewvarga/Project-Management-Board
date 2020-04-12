import React, {Component} from 'react';

class  IconCheck extends Component {
    render() {
        return (
            <svg  className={(this.props.className ? this.props.className : "")}
                onClick={(e) => {this.props.onClick(e)}} version="1.1" x="0px" y="0px" viewBox="0 0 512 512" >
                <g>
                    <path d="M504.502,75.496c-9.997-9.998-26.205-9.998-36.204,0L161.594,382.203L43.702,264.311c-9.997-9.998-26.205-9.997-36.204,0
                        c-9.998,9.997-9.998,26.205,0,36.203l135.994,135.992c9.994,9.997,26.214,9.99,36.204,0L504.502,111.7
                        C514.5,101.703,514.499,85.494,504.502,75.496z"/>
                </g>
            </svg>
        )
    }
    
}

export default IconCheck;