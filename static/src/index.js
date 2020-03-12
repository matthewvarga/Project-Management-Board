import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory,
    useLocation
} from "react-router-dom";
import Board from "./board/index";
import './styles/globals';
import './styles';

ReactDOM.render(
    <Router>
        <Switch>
            <Route path={"/"}>
                <Board>
                    <div className={"temp_col"}></div>
                    <div className={"temp_col one"}></div>
                    <div className={"temp_col two"}></div>
                    <div className={"temp_col three"}></div>
                    <div className={"temp_col four"}></div>
                    <a href="http://project-management.tools/api/repos">Get Repos</a>
                    <a href="https://github.com/login/oauth/authorize?scope=repo&client_id=ecd70f356de063418ef0&redirect_uri=http://project-management.tools/oauth/redirect">Login with github</a>
                </Board>
            </Route>
        </Switch>
    </Router>,
    document.getElementById('root')
);
