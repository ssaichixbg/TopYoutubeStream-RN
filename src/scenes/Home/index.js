import React, { Component } from 'react';

import StreamList from './StreamList'
import { connect } from "react-redux";
import { fetchHotYoutubeStream, displayError } from "../../actions/YoutubeStreams";
import youtubeStreams from "../../reducers/YoutubeStreams";


const mapStateToProps = state => {
    return {
        streamList: state.youtubeStreams.items,
        count: state.youtubeStreams.total,
        error: state.youtubeStreams.error,
        loading: state.youtubeStreams.loading
    }
};

const mapDispatchToProps = dispatch => {
    return {
        refreshList: () => {
            dispatch(fetchHotYoutubeStream());
        },
        displayErrorMsg: () => {
            dispatch(displayError());
        }
    }
};

export default visibleStreamList = connect(
    mapStateToProps,
    mapDispatchToProps
)(StreamList);