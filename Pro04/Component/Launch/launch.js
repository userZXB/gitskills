import React,{Component}from 'react';
import {StyleSheet,View,Image,Dimensions}from 'react-native';
import Login from '../Login/login';
import Main from '../Home/main';
import Viewer from '../ImageView/viewer'
// noinspection JSAnnotator
export default class launch extends React.Component<Props>{
    render(){
        return(
          <View style={styles.containerStyle}>
            <Image source={{uri:'icon_launch'}} style={{height:Dimensions.get('window').height,width:Dimensions.get('window').width}}/>
          </View>
              );
    }
    componentDidMount(){
        setTimeout(()=>{
            this.props.navigation.navigate('login');
        },1000);
    }
}
const styles=StyleSheet.create({
    containerStyle:{
        flex:1
    }
});
