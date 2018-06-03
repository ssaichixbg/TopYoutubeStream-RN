import React, { Component } from 'react';
import {
    Container, Header, Title, Content, Footer, FooterTab, Button,
    Left, Right, Body, Icon, Text
} from 'native-base';
import {
    FlatList,
    StyleSheet,
} from "react-native";
import StreamCard from "./StreamCard";

export default class StreamList extends Component {
    static navigationOptions = {
        title: '🔥Hot Stream Now',
    };

    componentDidMount() {
       this.props.refreshList();
    }

    didPressCard(item) {
        this.props.navigation.navigate('StreamChat', {
            item
        });
    }

    renderItem() {
        return ({item}, index) => {
            const onPress = () => this.didPressCard(item);
            return (
                <StreamCard
                    image={item.thumbnails.high.url}
                    title={item.title}
                    subtitle={item.channelTitle}
                    time={new Date(item.publishedAt)}
                    id={item.videoId}
                    onPress={onPress}
                    style={styles.margin}
                />
            )
        }
    }

    render() {
        return (
            <Container>
                <Content>
                    <FlatList
                        data={ this.props.streamList }
                        renderItem={ this.renderItem() }
                        onRefresh={ this.props.refreshList }
                        refreshing={ this.props.loading }
                    />
                </Content>

            </Container>
        );
    }
}

const styles = StyleSheet.create({
    margin: {
       marginLeft: 10,
       marginRight: 10
    },
});