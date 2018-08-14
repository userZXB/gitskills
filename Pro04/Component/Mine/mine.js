import React,{Component}from 'react';
import {StyleSheet, View, Text, Platform, Image, TouchableOpacity} from 'react-native';
import CommonCell from './commonCell'
// noinspection JSAnnotator
export default class mine extends React.Component<Props>{
        render(){
        return(
            <View style={styles.container}>
                {this.renderNavBar()}
              <TouchableOpacity activeOpacity={0.5} onPress={this._NavToShoppingCart.bind(this)}>
                  <CommonCell title='交易记录'/>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.5} onPress={this. _NavToMyActivity.bind(this)}>
                    <CommonCell title='我的动态'/>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.5} onPress={this._NavToMyAttention.bind(this)}>
                    <CommonCell title='我的关注'/>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.5} onPress={this._NavToShoppingCart.bind(this)}>
                    <CommonCell title='购物车'/>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.5} onPress={this._NavToShoppingCart.bind(this)}>
                    <CommonCell title='我的设置'/>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.5} onPress={this._NavToShoppingCart.bind(this)}>
                    <CommonCell title='举报'/>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.5} onPress={this._NavToLogin.bind(this)}>
                    <CommonCell title='退出登录'/>
              </TouchableOpacity>


            </View>
        );
    }
    _NavToShoppingCart(){
        this.props.navigation.navigate('cart');
    }
    _NavToMyAttention(){
        this.props.navigation.navigate('attention');
    }
    _NavToMyActivity(){
        this.props.navigation.navigate('activity');/*我的参数从哪获得*/
    }
    _NavToLogin(){
        console.log("tuichu");
        storage.remove({
            key: 'loginState'
        });
        this.props.navigation.navigator("login");
    }
    renderNavBar(){
            return(
                <View style={styles.navViewStyle}>
                    <TouchableOpacity onPress={()=>{alert("这是头像")}} style={styles.leftViewStyle}>
                        <Image source={{uri:'icon_portrait1'}} style={styles.navImageStyle}/>
                    </TouchableOpacity>
                    <View style={styles.rightViewStyle}>
                        <Text style={{color:'white',fontSize:20}}>lilyWhite</Text>
                    </View>
                </View>
            );
    }
}
const styles=StyleSheet.create({
    container:{
        flex:1,

    },
    leftViewStyle:{
        marginLeft:20,
        marginTop:100,
        marginRight:20
        //position:'absolute',
        //left:10
    },
    rightViewStyle:{

       height:35,
        marginTop:170,
    },
    navImageStyle:{
        width:Platform.OS==='ios'?120:115,
        height:Platform.OS==='ios'?120:115,
        borderRadius:12
    },
    text:{
         fontSize:20,
        marginLeft:5,
    },
    navViewStyle:{
        height:Platform.OS==='ios'?250:245,
        backgroundColor:'#7274eb',
        flexDirection:'row',
    }
});
