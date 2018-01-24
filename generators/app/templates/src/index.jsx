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

const config = {
  survey_prompt: 'aa_config_survey_prompt',
  answer_1_text: 'aa_config_answer_1_text',
  answer_2_text: 'aa_config_answer_2_text',
  answer_3_text: 'aa_config_answer_3_text',
  answer_4_text: 'aa_config_answer_4_text',
  thankyou_page_content: 'aa_config_thankyou_page_content',
  final_page_select: 'aa_config_final_page_select',
};

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
  appId: 'aa_config_app_id',
  hasVoted: false,
  votedAnswer: false
};

const store = createStore(state, hashHistory);
const history = syncHistoryWithStore(hashHistory, store);

const App = () => (<AppContainer history={history} store={store} routes={routes}/>);
const HotApp = hot(module)(App);


render(
  <HotApp/>,
  MOUNT_NODE
);
