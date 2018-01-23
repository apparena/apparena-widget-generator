import actionTypes from "./types";
import axios from "axios";
import {saveState} from "../helpers/localStorage";

/**
 * Persist a user's vote in the dynamo DB
 *
 * @param answer int The index of the answer (1 through 4)
 * @param appId string The appId of the widget
 */
export function addVote(answer) {
    return (dispatch, getState) => {
        const state = getState();
        const route = 'https://h170vfzrjh.execute-api.eu-central-1.amazonaws.com/dev/vote';
        const params = {
            question: state.config.survey_prompt,
            answer,
            appId: state.appId,
            meta_data: {},
        };

        return axios.post(route, params)
            .then((response) => {
                dispatch({
                    type: actionTypes.addVote,
                    data: answer,
                    votes: response.data
                });
            })
            .catch((error) => {
                dispatch({
                    type: actionTypes.addVoteError,
                    data: answer,
                    error
                });
            });
    };
}