import React,{Component}from 'react';
import {StyleSheet,View,Text,Image,Dimensions}from 'react-native';
export default class CommonCell extends React.Component<Props> {
     static defaultProps ={
             title:''
        };

    render(){
        return(
            <View style={styles.container}>
              <View style={styles.ImageView}>
                  <Image source={{uri:'icon_mine_shoppingCart'}} style={{width:35,height:35}}/>
              </View>
              <Text style={styles.text}>{this.props.title}</Text>

            </View>
        );
    }

}
const styles=StyleSheet.create({
    container:{
        height:50,
        width:Dimensions.get('window').width,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#e8e8e8',
        borderBottomWidth:0.5,
        borderBottomColor:'gray'
    },
    ImageView:{
        width:40,
        height:40,
        marginLeft:10,
        marginRight:15,
        backgroundColor:'gray',
    },
    leftImage:{

    },
    text:{
        fontSize:20,
        color:'black'
    }
})