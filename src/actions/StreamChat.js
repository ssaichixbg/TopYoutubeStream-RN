import axios from "axios";
import { GOOGLE_CLIENT_KEY } from '../constants';

export const START_FETCH_CHAT_META = 'START_FETCH_CHAT_META';
function _startFetchChatMeta() {
    return {
        type: START_FETCH_CHAT_META,
    }
}

export const FINISH_WITH_ERROR = 'FINISH_WITH_ERROR';
export function finishWithError(error) {
    return {
        type: FINISH_WITH_ERROR,
        error
    }
}

export const FINISH_FETCH_CHAT_META = 'FINISH_FETCH_CHAT_META';
export function finishFetchChatMeta(id, meta) {
    return {
        type: FINISH_FETCH_CHAT_META,
        id,
        meta
    }
}

export const START_FETCH_CHAT_MSG = 'START_FETCH_CHAT_MSG';
function _startFetchChatMsg(id) {
    return {
        type: START_FETCH_CHAT_MSG,
        id
    }
}

export const UPDATE_CHAT_MSG = 'UPDATE_CHAT_MSG';
export function updateChatMsg(id, msgs, nextUpdate) {
    return {
        type: UPDATE_CHAT_MSG,
        id,
        msgs,
        nextUpdate
    }
}

export const STOP_FETCH_CHAT_MSG = 'STOP_FETCH_CHAT_MSG';
export function stopFetchChatMsg(id) {
    return {
        type: STOP_FETCH_CHAT_MSG,
        id
    }
}

export const FILTER_CHAT_MSG = 'FILTER_CHAT_MSG';
export function filterChatMsg(filter) {
    return {
        type: FILTER_CHAT_MSG,
        filter
    }
}


function _fetchChatMeta(id, dispatch) {
    return axios.get(
        'https://www.googleapis.com/youtube/v3/videos',
        {
            params: {
                'id': id,
                'part': 'snippet,contentDetails,statistics,liveStreamingDetails',
                'key': GOOGLE_CLIENT_KEY
            }
        }
    )
        .then(
            response => {
                if (response.data.items.length == 0) {
                    return Promise.reject(new Error("No chat in the Stream"));
                }
                return response.data.items[0];
            }
        )
        .then(
            json => {
                json.chatId = json.liveStreamingDetails.activeLiveChatId;
                dispatch(finishFetchChatMeta(id, json));
                return json;
            },
            error => {
                console.log('error when startFetchChatMeta', error);
                dispatch(finishWithError(error));
                return error
            }
        )

}

export function startFetchChatMeta(videoId) {
    return function (dispatch) {
        dispatch(_startFetchChatMeta());
        return _fetchChatMeta(videoId, dispatch)
    }
}

export function startFetchChatMsg(videoId, nextUpdate) {

    const _fetchChatMsg = (chatId, dispatch) => {
        dispatch(_startFetchChatMsg());
        let params =  {
            'liveChatId': chatId,
            'part': 'snippet, authorDetails',
            'key': GOOGLE_CLIENT_KEY,
        };
        if (!!nextUpdate) {
            params['pageToken'] = nextUpdate.token;
        }

        return axios.get(
            'https://www.googleapis.com/youtube/v3/liveChat/messages',
            {
                params: params
            })
            .then(
                response => response.data,
                error => {
                    console.log('error when _fetchChatMsg', error);
                    dispatch(finishWithError(error));
                    return error;
                }
            )
            .then(
                response => {
                    const msgs = response.items.map(msg=>{
                        return {
                            id: msg.id,
                            ...msg.snippet,
                            ...msg.authorDetails
                        }
                    });

                    dispatch(updateChatMsg(chatId, msgs, {
                        token: response.nextPageToken,
                        interval: response.pollingIntervalMillis,
                        chatId
                    }));
                    return response;
                }
            )
    };

    if (!nextUpdate) {
        return function (dispatch) {
            dispatch(_startFetchChatMeta());
            return _fetchChatMeta(videoId, dispatch)
                .then(
                    data => {
                        const chatId = data.liveStreamingDetails.activeLiveChatId;
                        return _fetchChatMsg(chatId, dispatch);
                    }
                )
        }
    }
    else {
        return function (dispatch) {
            return _fetchChatMsg(nextUpdate.chatId, dispatch);
        }
    }

}