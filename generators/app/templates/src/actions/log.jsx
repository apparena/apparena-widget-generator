/**
 * Redux-Action-Wrapper for sending logs to Analytics-Integrations
 * Adds the AppId from the Redux-State to the Data send to AppArena BigData Cluster
 */
import actionTypes from './types'

/**
 * Identify Call
 * https://segment.com/docs/sources/website/analytics.js/#identify
 * @param args
 * @returns {function(*, *)}
 */
export function identify(...args) {
  return (dispatch, getState) => {
    const state = getState();
    const appId = state.appId;
    if (appId && window.analytics) {
      window.analytics.options.appId = appId;
      window.analytics.identify(...args);
      delete window.analytics.options.appId;
      dispatch({
        type: actionTypes.identify,
        data: args
      });
    }
  }
}

/**
 * Track Call
 * https://segment.com/docs/sources/website/analytics.js/#track
 * @param args
 * @returns {function(*, *)}
 */
export function track(...args) {
  return (dispatch, getState) => {
    const state = getState();
    const appId = state.appId;
    if (appId && window.analytics) {
      window.analytics.options.appId = appId;
      window.analytics.track(...args);
      delete window.analytics.options.appId;
      dispatch({
        type: actionTypes.track,
        data: args
      });
    }
  }
}

/**
 * Group Call
 * https://segment.com/docs/sources/website/analytics.js/#group
 * @param args
 * @returns {function(*, *)}
 */
export function group(...args) {
  return (dispatch, getState) => {
    const state = getState();
    const appId = state.appId;
    if (appId && window.analytics) {
      window.analytics.options.appId = appId;
      window.analytics.group(...args);
      delete window.analytics.options.appId;
      dispatch({
        type: actionTypes.group,
        data: args
      });
    }
  }
}

/**
 * Page Call
 * https://segment.com/docs/sources/website/analytics.js/#page
 * @param args
 * @returns {function(*, *)}
 */
export function page(...args) {
  return (dispatch, getState) => {
    const state = getState();
    const appId = state.appId;
    if (appId && window.analytics) {
      window.analytics.options.appId = appId;
      window.analytics.page(...args);
      delete window.analytics.options.appId;
      dispatch({
        type: actionTypes.page,
        data: args
      });
    }
  }
}

/**
 * Alias Call
 * https://segment.com/docs/sources/website/analytics.js/#alias
 * @param args
 * @returns {function(*, *)}
 */
export function alias(...args) {
  return (dispatch, getState) => {
    const state = getState();
    const appId = state.appId;
    if (appId && window.analytics) {
      window.analytics.options.appId = appId;
      window.analytics.alias(...args);
      delete window.analytics.options.appId;
      dispatch({
        type: actionTypes.alias,
        data: args
      });
    }
  }
}
