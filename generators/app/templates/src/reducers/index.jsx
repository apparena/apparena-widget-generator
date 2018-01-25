import appId from "./appId";
import log from "./log";
import config from "./config";
import {combineReducers} from "redux";
import {routerReducer} from "react-router-redux";

const appReducer = combineReducers({
  appId,
  log,
  config,
  routing: routerReducer,
});

export default appReducer;
