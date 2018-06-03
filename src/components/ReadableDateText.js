import React, { Component } from 'react';

import { Text } from "react-native";

export default class ReadableDateText extends Component {
    readableDate() {
        const timestamp = this.props.date.getTime() / 1000;
        const delta = Date.now() / 1000 - timestamp;
        if (delta < 60) {
            return delta.toFixed(0) + " s ago";
        }
        else if (delta < 60 * 60) {
            return (delta / 60).toFixed(0) + " mins ago";
        }
        else if (delta < 60 * 60 * 24) {
            return (delta / 60 / 60).toFixed(0) + " hours ago";
        }
        else {
            return (delta / 60/ 60/ 24).toFixed(0) + " days ago";
        }
    }
    
    render() {
        return (
            <Text style={{...this.props.style}}>{this.readableDate()}</Text>
        );
    }
}