import React, { Component } from 'react';
import { Image } from 'react-native';
import {
    Container, Header, Content, Card,
    CardItem, Thumbnail, Text, Button, Icon,
    Left, Body, Right
} from 'native-base';
import ReadableDateText from '../../components/ReadableDateText'

export default class StreamCard extends Component{
    render() {
        return (
            <Card style={this.props.style}>
                <CardItem button onPress={ this.props.onPress }>
                    <Left>
                        <Body>
                            <Text>{this.props.title}</Text>
                            <Text note>{this.props.subtitle}</Text>
                        </Body>
                    </Left>
                </CardItem>
                <CardItem cardBody button onPress={ this.props.onPress }>
                    <Image source={{uri: this.props.image}} style={{height: 200, width: null, flex: 1}}/>
                </CardItem>
                <CardItem button onPress={ this.props.onPress }>
                    {/*<Left>*/}
                        {/*<Icon active name="person" />*/}
                        {/*<Text>12 viewers</Text>*/}
                    {/*</Left>*/}

                    <Left>
                        <ReadableDateText date={this.props.time}/>
                    </Left>
                </CardItem>
            </Card>
        );
    }
}