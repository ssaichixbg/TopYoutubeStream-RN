import axios from "axios";
import { GOOGLE_CLIENT_KEY } from '../constants';

export const START_REFRESH = 'START_REFRESH_STREAM';
function startRefresh() {
    return {
        type: START_REFRESH
    }
}

export const FINISH_REFRESH = 'FINISH_REFRESH_STREAM';
function finishRefresh(data) {
    return {
        type: FINISH_REFRESH,
        data
    }
}

export const FINISH_REFRESH_WITH_ERROR = 'STREAM_FINISH_REFRESH_WITH_ERROR';
function finishRefreshWithError(error) {
    return {
        type: FINISH_REFRESH_WITH_ERROR,
        error
    }
}

export const DISPLAY_ERROR = 'STREAM_DISPLAY_ERROR';
export function displayError() {
    return {
        type: DISPLAY_ERROR
    }
}

export function fetchHotYoutubeStream() {
    return function (dispatch) {
        dispatch(startRefresh());

        return axios.get(
            'https://www.googleapis.com/youtube/v3/search',
            {
                params: {
                    'part': 'snippet',
                    'eventType': 'live',
                    'maxResults': '25',
                    'type': 'video',
                    'key': GOOGLE_CLIENT_KEY,
                    'order': 'viewCount',
                }
            }
        )
            .then(
                response => response.data,
                error => {
                    console.log('error when fetchHotYoutubeStream', error);
                    dispatch(finishRefreshWithError(error))
                }
            )
            .then(json=>
                dispatch(finishRefresh(json))
            )
    }
}