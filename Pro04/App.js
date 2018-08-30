/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import Launch from './Component/Launch/launch';
import Login from './Component/Launch/login';
import Register from './Component/Launch/register';
import Main from './Component/Home/main';
import { createStackNavigator} from 'react-navigation';
import {AsyncStorage} from 'react-native';
import Storage from 'react-native-storage';
var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,/*数据存储引擎，不指定则存储在内存，一旦app重启，数据丢失*/
    defaultExpires: null,/*设置为null意思为数据存储永不过期*/
    enableCache: true,
    sync:require('./sync')
});
const Navigator = createStackNavigator(

    {
        launch:{screen:Launch},
        login:{screen:Login},
        register:{screen:Register},
        main:{screen:Main},
    },
    {
        initialRouteName:'launch',
        backBehavior:'none',
        navigationOptions:{
            header:null,
            showIcon:true,
            swipeEnabled:false,
            animationEnabled:false,
        },
        mode:'card',
    });
global.storage = storage;/*全局变量，确保在后面的js文件可以使用此变量*/
export default class APP extends React.Component {
    render() {
        return (
            <Navigator/>
        );
    }
}

