import {
    START_REFRESH,
    FINISH_REFRESH_WITH_ERROR,
    FINISH_REFRESH,
    DISPLAY_ERROR,
} from "../actions/YoutubeStreams";

const initialState = {
    items: [],
    total: 0,
    nextPage: '',
    loading: false,
    error: null
};

function mergeItems(state, action) {
    let newItems =  action.data.items.map(item => {
        return {
            ...item.id,
            ...item.snippet
        }
    });

    return newItems;
}

export default function youtubeStreams(state = initialState, action) {
    switch (action.type) {
        case START_REFRESH:
            return {
                ...state,
                loading: true,
                error: null
            };
        case FINISH_REFRESH_WITH_ERROR:
            return {
                ...state,
                loading: false,
                error: state.error
            };
        case DISPLAY_ERROR:
            return {
                ...state,
                error: null
            };
        case FINISH_REFRESH:
            return {
                ...state,
                items: mergeItems(state, action),
                total: action.data.pageInfo.totalResults,
                nextPage: action.data.nextPageToken,
                loading: false,
            };
        default:
            return state;
    }
}