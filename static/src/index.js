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
import PrivateRoute from './private_route/index';
import Board from "./board/index";
import TicketPage from './ticket_page/index';
import LoginPage from './login_page/index';
import './styles/globals';
import './styles';

const store = createStore(rootReducer);

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Switch>
                <Route path={"/tickets/:id"} component={TicketPage}/>
                <PrivateRoute path={"/dashboard"}>
                    <Board/>
                </PrivateRoute>
                <Route path={"/"}>
                    <LoginPage />
                </Route>
                
            </Switch>
        </Router>
    </Provider>,    
    document.getElementById('root')
);