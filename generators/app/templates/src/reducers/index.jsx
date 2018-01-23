import config from "./config";
import appId from "./appId";
import {combineReducers} from "redux";
import {routerReducer} from "react-router-redux";

const appReducer = combineReducers({
    config,
    appId,
    routing: routerReducer,
});

export default appReducer;
