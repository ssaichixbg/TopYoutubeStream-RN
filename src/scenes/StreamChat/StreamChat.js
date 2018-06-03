import React, { Component } from 'react';
import {
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    View,
    TextInput
} from "react-native";
import {
    ListItem,
    Body,
    Container,
    Footer,
    Content,
    FooterTab,
    Button,
    Left,
    Right,
    Text,
    Toast
} from 'native-base';
import ReadableDateText from "../../components/ReadableDateText";

export default class StreamChat extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('item').title,
        };
    };
    videoId = this.props.navigation.getParam('item').videoId;

    constructor(props) {
        super(props);
        self.state={
            updateTimer: -1
        }
    }

    componentDidMount() {
        this.props.refreshChat(this.videoId, this.props.nextUpdate);
    }

    componentWillUnmount() {
        clearTimeout(self.state.updateTimer);
    }

    componentWillReceiveProps(nextProps) {
        if (!!nextProps.nextUpdate && nextProps.nextUpdate !== this.props.nextUpdate) {
            const updateTimer = setTimeout(() =>{
                this.props.refreshChat(this.videoId, this.props.nextUpdate);
            }, nextProps.nextUpdate.interval + 300);
            this.setState({
                updateTimer
            });

            Toast.show({
                text: nextProps.speed.toFixed(1) + ' msgs / sec',
                position: "top",
                duration: 5000
            });
        }
        else if (!!nextProps.error && nextProps.error !== this.props.error) {
            Toast.show({
                text: nextProps.error.message,
                buttonText: "Okay",
                position: "top",
                duration: 3000
            });
            setTimeout(()=> this.props.displayErrorMsg(), 300);
        }
    }

    renderItem({item}, index) {
        return (
            <ListItem  style={ styles.margin }>
                <Body>
                    <Text>{ item.displayName + ": "}</Text>
                    <Text note>{ item.displayMessage }</Text>
                </Body>
                <Right>
                    <ReadableDateText date={new Date(item.publishedAt)}/>
                </Right>
            </ListItem>
        )
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled keyboardVerticalOffset={60}>
                <FlatList
                    style={styles.flatList}
                    data={ this.props.chatList }
                    renderItem={ this.renderItem }
                    onRefresh={ ()=> this.props.refreshChat(this.videoId, this.props.nextUpdate) }
                    refreshing={ this.props.loading }
                />

                <TextInput style={styles.filter}
                           onChangeText={(username)=>this.props.setFilter({username})}
                           value={this.props.filter.username}
                           placeholder='Filter by Username'/>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    margin: {
        marginLeft: 10,
        marginRight: 10
    },
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    flatList: {
        flex: 1,
    },
    filter: {
        marginLeft: 10,
        marginRight: 10,
        height: 44
    }
});