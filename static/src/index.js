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
import { Provider } from 'react-redux'; 
import { createStore } from 'redux';
import rootReducer from './reducers';
import Board from "./board/index";
import './styles/globals';
import './styles';

const store = createStore(rootReducer);

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Switch>
                <Route path={"/"}>
                    <Board></Board>
                    <a href="https://github.com/login/oauth/authorize?scope=repo&client_id=e01c4cb7708610450afc&redirect_uri=https://project-management.tools/oauth/redirect">Login with github</a>
                </Route>
            </Switch>
        </Router>
    </Provider>,    
    document.getElementById('root')
);
