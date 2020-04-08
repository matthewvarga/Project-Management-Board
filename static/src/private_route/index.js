import React, { Component } from "react";
import {
    BrowserRouter as Router,
    Route,
    Redirect,
} from "react-router-dom";


class PrivateRoute extends Component {

    getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
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