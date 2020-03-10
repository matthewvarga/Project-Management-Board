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
                <Board></Board>
                <a href="http://localhost:3000/api/repos">Get Repos</a>
                <a href="https://github.com/login/oauth/authorize?scope=repo&client_id=ecd70f356de063418ef0&redirect_uri=http://localhost:3000/oauth/redirect">Login with github</a>
            </Route>
        </Switch>
    </Router>,
    document.getElementById('root')
);