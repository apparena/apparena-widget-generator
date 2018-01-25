import "babel-polyfill";
import {hot} from "react-hot-loader";
import React from "react";
import {render} from 'react-dom'
import syncHistoryWithStore from "react-router-redux/lib/sync";
import {hashHistory} from "react-router";
import routes from "./router/routes";
import AppContainer from "./containers/appContainer";
import createStore from "./store/createStore";
import {loadState} from "./helpers/localStorage";
import "./components/index.scss"
import config from './config/aa_config.json';

// ========================================================
// Setup
// ========================================================
const MOUNT_NODE = document.getElementById('widget-container');

// ========================================================
// Store Instantiation
// ========================================================
const initialState = window.__initialState || {};
const localStorageState = loadState();

// Pass the initial state into the redux store
const state = {
  ...initialState,
  ...localStorageState,
  config,
  appId: 'aa_config_app_id'
};

const store = createStore(state, hashHistory);
const history = syncHistoryWithStore(hashHistory, store);

const App = () => (<AppContainer history={history} store={store} routes={routes}/>);
const HotApp = hot(module)(App);


render(
  <HotApp/>,
  MOUNT_NODE
);
