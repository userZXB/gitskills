import React,{Component}from 'react';
import Home from './home';
import News from '../News/news';
import Mine from '../Mine/mine';
import Shop from '../Shop/shop';
import Community from '../Community/community';
import Search from './search';
import {StyleSheet, Image, View} from 'react-native';
import {createBottomTabNavigator, createStackNavigator} from "react-navigation";
import ShoppingCart from "../Mine/shoppingCart";
import MyAttention from "../Mine/MyAttention";
import { YellowBox } from 'react-native';
import AttentionHome from "../Mine/AttentionHome";
import Activity from "../Mine/Myactivity";
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
const Tab = createBottomTabNavigator(
    {
        home:{
            screen:Home,
            navigationOptions:{
                tabBarLabel: '主页',
                tabBarIcon: ({tintColor}) => (
                    <Image
                        source={{uri:'icon_tabbar_homepage'}}
                        style={{tintColor: tintColor,width:30, height:30}}
                    />
                ),}
             },
        shop:{
            screen:Shop,
            navigationOptions:{
                tabBarLabel: '微淘',
                tabBarIcon: ({tintColor}) => (
                    <Image
                        source={{uri:'icon_tabbar_merchant_normal'}}
                        style={{tintColor: tintColor,width:30, height:30}}
                    />
                ),
             }
        },
        news:{
            screen:News,
            navigationOptions:{
                tabBarLabel: '消息',
                tabBarIcon: ({tintColor}) => (
                    <Image
                        source={{uri:'icon_tabbar_news'}}
                        style={{tintColor: tintColor,width:30, height:30}}
                    />
                ),}
        },
        mine:{
            screen:Mine,
            navigationOptions:{
                tabBarLabel: '我的',
                tabBarIcon: ({tintColor}) => (
                    <Image
                        source={{uri:'icon_tabbar_mine'}}
                        style={{tintColor: tintColor,width:30, height:30}}
                    />
                ),}
        },
    },
  {
        animationEnabled: false, // 切换页面没有效果，直接跳转到相应页面，get it
        tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的
        swipeEnabled: false, // 是否可以左右滑动切换tab
        backBehavior:'initialRoute', // 已经解决按android返回键返回第一个界面home，get it
        lazy:true,
        tabBarOptions: {
            activeTintColor: '#7274eb', // 文字和图片选中颜色
            inactiveTintColor: '#999', // 文字和图片未选中颜色
            showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示
            indicatorStyle: {
                height: 0  /*切换时是否有指示器，显示到达不同页面*/
            },
            style: {
                backgroundColor: '#fff', // TabBar 背景色
                height: 50,
                justifyContent:'center'
            },
            labelStyle: {
                fontSize: 10, // 文字大小
                marginTop:1.5,/*设置文字和图片的距离,解决*/
                padding:1.5,
            },
        }
    }
);
/*navigationOptions优先级:页面静态配置的>RouteConfigs>StackNaviagtorConfigs
* get it..*/
/*如果不设置header=null，就会显示为空，我也是很无奈,在具体页面可以设置header，这样可以覆盖*/
const Navigator =  createStackNavigator(
    {
        tab: {screen: Tab},
        search: {screen: Search},
        cart: {screen: ShoppingCart},
        attention:{screen: MyAttention},
        attentionHome:{screen:AttentionHome},
        community:{screen:Community},
        activity:{screen:Activity}
    },
    {
        initialRouteName:'tab',
        navigationOptions:{
            showIcon:true,
            swipeEnabled:false,
            animationEnabled:false,
            header:null
        },
        mode:'card',
    }
);
export default class main extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selectedTab:'home'
        }
    }
    render(){
      return(
          <Navigator />
      );
}

}
const styles = StyleSheet.create({
    selectedTitleStyle:{
        color:'orange'
    }
})
