import React, { Component } from "react";
import {
    BrowserRouter as Router,
    Route,
    Redirect,
} from "react-router-dom";


class PrivateRoute extends Component {

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
        let theseProps = {...this.props};
        delete theseProps.children;

        return (
            <Route theseProps
                render={({ location }) =>
                    (this.getCookie("username")) ? (
                        this.props.children
                    ) : (
                            <Redirect
                                to={{
                                    pathname: "/",
                                    state: { from: location }
                                }}
                            />
                        )
                }
            />
        );
    }
}


export default PrivateRoute;