import {
    START_FETCH_CHAT_MSG,
    START_FETCH_CHAT_META,
    STOP_FETCH_CHAT_MSG,
    FINISH_FETCH_CHAT_META,
    FILTER_CHAT_MSG,
    UPDATE_CHAT_MSG,
    FINISH_WITH_ERROR
} from "../actions/StreamChat";

const initialState = {
    loadingMeta: false,
    loadingChat: false,
    error: null,
    filter: {},
    timers: {},
    chatMsg: {},
    chatMeta: {},
    nextUpdate: {},
    speed: 0,
};

export default function streamChat(state = initialState, action) {
    const id = action.id;
    switch (action.type) {
        case START_FETCH_CHAT_META:
            return {
                ...state,
                loadingMeta: true
            };
        case FINISH_FETCH_CHAT_META:
            const chatMeta = state.chatMeta;
            chatMeta[id] = action.meta;
            return {
                ...state,
                chatMeta
            };
        case FINISH_WITH_ERROR:
            return {
                ...state,
                loadingMeta: false,
                loadingChat: false,
                error: action.error
            };
        case START_FETCH_CHAT_MSG:
            return {
                ...state,
                loadingChat: true
            };
        case UPDATE_CHAT_MSG:
            const chatMsg = state.chatMsg;
            chatMsg[id] = chatMsg[id] || [];
            chatMsg[id] = chatMsg[id].concat(action.msgs);
            const nextUpdate = state.nextUpdate;
            nextUpdate[id] = action.nextUpdate;
            const speed = action.msgs.length / (state.nextUpdate[id].interval / 1000);
            return {
                ...state,
                loadingChat: false,
                chatMsg,
                nextUpdate,
                speed
            };
        case STOP_FETCH_CHAT_MSG:
            if (!!state.timers[id]) {
                clearInterval(state.timers[id]);
            }
            delete state.timers[id];
            return {
                ...state,
                timers: state.timers
            };
        case FILTER_CHAT_MSG:
            return {
                ...state,
                filter: action.filter
            };
        default:
            return state;
    }
}
