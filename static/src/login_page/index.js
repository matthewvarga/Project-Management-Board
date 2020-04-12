import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import IconGithub from '../../icons/github';
import './styles';

class LoginPage extends Component {

    constructor(props) {
        super(props);
    }

    getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return null;
    }

    render() {

        if(this.getCookie("username")) {
            return (
                <Redirect to="/dashboard"/>
            )
        }
        return (
            <div className={"login_page " + (this.props.className ? this.props.className : "")} >
                <a className={"github_btn"}
                    href={"https://github.com/login/oauth/authorize?scope=repo&client_id=ecd70f356de063418ef0&redirect_uri=http://localhost:3000/oauth/redirect"}> 
                    <IconGithub className={"github_icon"} /> Login with GitHub</a>
            </div>
        )
    }
}

export default LoginPage;