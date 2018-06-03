/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import topYoutubeApp from './src/reducers'
import { Root } from "native-base";

import HomeScreen from "./src/scenes/Home";
import StreamChatScreen from "./src/scenes/StreamChat";


const loggerMiddleware = createLogger();
const store = createStore(
    topYoutubeApp,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
);
const RootStack = createStackNavigator(
    {
        Home: HomeScreen,
        StreamChat: StreamChatScreen
    },
    {
        initialRouteName: 'Home',
        /* The header config from HomeScreen is now here */
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },
    }
    );

export default class App extends Component {
    render() {
        return <Provider store={store}>
                    <Root><RootStack/></Root>
                </Provider>
    }
}

console.disableYellowBox = true;


