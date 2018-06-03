import StreamChat from "./StreamChat";
import { connect } from "react-redux";
import {
    startFetchChatMeta,
    startFetchChatMsg,
    stopFetchChatMsg,
    filterChatMsg
} from "../../actions/StreamChat"
import {fetchHotYoutubeStream} from "../../actions/YoutubeStreams";
import StreamList from "../Home/StreamList";
import streamChat from "../../reducers/StreamChat";


function applyFilter(msgs, filter) {
    if (!msgs) { return []};
    let newMsgs = [...msgs];
    newMsgs.reverse();

    if (!filter.username || filter.username.length == 0) {
        return newMsgs;
    }

    return newMsgs.filter(msg=>{
        return msg.displayName.indexOf(filter.username) >= 0
    });
}

const mapStateToProps = (state, props) => {
    const item = props.navigation.getParam('item');
    const meta = state.streamChat.chatMeta[item.videoId];
    const chatId = meta ? meta.chatId : null;

    return {
        chatList: applyFilter(state.streamChat.chatMsg[chatId], state.streamChat.filter),
        chatId,
        loading: state.streamChat.loadingChat,
        nextUpdate: state.streamChat.nextUpdate[chatId],
        filter: state.streamChat.filter,
        error: state.streamChat.error,
        speed: state.streamChat.speed
    }
};

const mapDispatchToProps = (dispatch, props) => {
    const item = props.navigation.getParam('item');
    return {
        refreshChat: (videoId, nextUpdate) => {
            dispatch(startFetchChatMsg(videoId, nextUpdate || null));
        },
        displayErrorMsg: () => {

        },
        setFilter: (filter) => {
            dispatch(filterChatMsg(filter))
        }
    }
};


export default visibleStreamChat = connect(
    mapStateToProps,
    mapDispatchToProps
)(StreamChat);