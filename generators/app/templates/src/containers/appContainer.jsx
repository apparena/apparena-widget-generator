import React, {Component} from "react";
import PropTypes from 'prop-types';
import {Router} from "react-router";
import {Provider} from "react-redux";

class AppContainer extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        routes: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired
    };

    shouldComponentUpdate() {
        return false
    }

    render() {
        const {routes, store, history} = this.props;
        return (
            <Provider store={store}>
                <div style={{height: '100%'}}>
                    <Router history={history} routes={routes}/>
                </div>
            </Provider>
        )
    }
}

export default AppContainer
