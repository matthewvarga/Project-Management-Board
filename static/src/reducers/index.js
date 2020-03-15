import { combineReducers } from "redux";
import repoList from "./repoList";
import board from "./board";

export default combineReducers({
    repoList,
    board,
});