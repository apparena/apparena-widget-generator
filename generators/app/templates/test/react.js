import 'jsdom-global/register';
import test from 'ava';
import {mount, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import React from 'react';
import {hashHistory} from "react-router";
import syncHistoryWithStore from "react-router-redux/lib/sync";
import createStore from "../src/store/createStore";
import routes from "../src/router/routes";
import Widget from '../src/containers/appContainer';

configure({adapter: new Adapter()});

test('react component is rendered correctly', t => {
    const store = createStore({
        answer1Votes: 0,
        answer2Votes: 0,
        answer3Votes: 0,
        answer4Votes: 0,
        appId: 13245,
        hasVoted: false,
        votedAnswer: 0
    }, hashHistory);
    const history = syncHistoryWithStore(hashHistory, store);
    const wrapper = mount(
        <Widget history={history} store={store} routes={routes}/>
    );
    const brandImage = wrapper.find('img');
    t.true(brandImage.is('img'));
});