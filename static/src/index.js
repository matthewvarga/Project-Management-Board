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
            <Route path={"*"}>
                <Board>
                    <div className={"temp_col"}></div>
                    <div className={"temp_col"}></div>
                    <div className={"temp_col"}></div>
                </Board>
            </Route>
        </Switch>
    </Router>,
    document.getElementById('root')
);