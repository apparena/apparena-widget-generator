import actionTypes from "../actions/types";

const defaultState = [];

export default function logReducer(state = defaultState, action = {}) {
  switch (action.type) {
    case actionTypes.identify:
    case actionTypes.track:
    case actionTypes.page:
    case actionTypes.group:
    case actionTypes.alias:
      return [...state, {...action}];
    default:
      return state;
  }
}
