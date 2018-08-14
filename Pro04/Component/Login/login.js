import React,{Component}from 'react';
var RSAKey= require('react-native-rsa');
import {StyleSheet, View, Image, TextInput, Text, Dimensions, TouchableOpacity} from 'react-native';
import Main from '../../Component/Home/main'
var Account;
var Password;
var PrivateKey;
/* Token用于持续登陆，因此应该在storage中设置永不过期,方便用于登陆*/
var userInfo=[];//用于判断登陆信息是否填写完整
// noinspection JSAnnotator
export default class Login extends React.Component<Props>{
    constructor(props){
        super(props);
        this._navToRegister = this._navToRegister.bind(this);
    }
    render(){
        return(
            <View style={styles.container}>
                <Image source={{uri:'icon_portrait'}} style={styles.iconStyle}/>
                <TextInput underlineColorAndroid='transparent' placeholder='请输入账号' style={styles.TextInputStyle} maxLength={20} onEndEditing={(event)=>{this._Account(event.nativeEvent.text);}}/>
                <TextInput underlineColorAndroid='transparent' placeholder='请输入密码' secureTextEntry={true} style={styles.TextInputStyle} onChangeText={(text)=>{this._Password(text);}}/>
                <TouchableOpacity activeOpacity={0.5} onPress={/*this._navToHome.bind(this)*/ this._login.bind(this)}>
                  <View style={styles.loginBtnStyle}>
                        <Text style={{color:'white'}}>登录</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.settingStyle}>
                   <TouchableOpacity activeOpacity={0.5} onPress={this._test.bind(this)}>
                      <Text>忘记密码</Text>
                   </TouchableOpacity>
                   <TouchableOpacity activeOpacity={0.5} onPress={this._navToRegister.bind(this)}>
                      <Text>注册</Text>
                   </TouchableOpacity>
                </View>
            </View>
        );

}
    _test(){
      /*因为是永不过期，不用设置sync方法再去重新加载*/

    }/*用于测试从数据仓库中读取数据*/
    _navToRegister(){
        this.props.navigation.navigate('register');
    }
    /*点击登陆，客户端先生成公钥的同时获取服务器分发的公钥。
    然后用服务器分发的公钥加密我的密码，把我的公钥，账户名，加密后的密文传给服务器，服务器返回用我的公钥加密后的token，
    当我想要查看私人信息时，就把token等MD5值给服务器，验证身份。
     */
    _Account(account){
        Account=account;
        userInfo.push(Account);
    }
    _Password(password){
        Password=password;
        userInfo.push(Password);
    }
    _encrypt(Key) {
            var rsa = new RSAKey();
            rsa.setPublicString(Key);
            var Cipher = rsa.encrypt(Password);
            this._generateKey(Cipher);
    }
    _getPubKey(){
        var url="http://192.168.137.132:3000/users/generkey?u_id=";
        var req = new Request(url+Account,{method: 'GET'});
        fetch(req).then((response)=>{
         if(response.ok)
              return response.json();
         else
              console.log("404")
         }).then((jsonData)=>{
              if(jsonData!=null)
                  if(jsonData.code=='0')
                      this._encrypt(jsonData.publicKey);
                   else
                      console.log("请先注册")
               }).catch((err)=>{
                   console.log(err);
        });
    }
    _generateKey(cipher) {
            const bits = 1024;
            const exponent = '10001'; // must be a string
            var rsa = new RSAKey();
            var r = rsa.generate(bits, exponent);
            var publicKey = rsa.getPublicString();
            PrivateKey = rsa.getPrivateString();
            this._VerifyLogin(publicKey,cipher);
}
    _VerifyLogin(pubKey,cipher){
        let formData = new FormData();
        formData.append("u_pub",pubKey);
        formData.append("u_id",Account);
        formData.append("password",cipher);
        var url='http://192.168.137.132:3000/users/login';
        console.log(formData);
        fetch(url , {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data"
            },
            body: formData
        }).then((res) =>{
           if(res.ok)
               return res.json();
           else
               console.log("404")
        }).then((jsonData)=>{
            if(jsonData!=null)
                if(jsonData.code=='0') {
                    var rsa = new RSAKey();
                    rsa.setPrivateString(PrivateKey);
                    var token = rsa.decrypt(jsonData.token);
                    storage.save({
                        key: 'loginState',  //保留用户的登录状态，永不过期，除非主动登出登陆状态,便销毁即可
                        data: {
                            account: Account,
                            token: token
                        }
                    });
                    this._navToHome();
                }
                else if(jsonData.code=='2')
                    console.log("数据库出错");
                else if(jsonData.code=='3')
                    console.log("密码错误");
                else
                    console.log("请重新登录");
        }).catch((err) => {
            console.log(err);
        });

    }
    _infoHasDone(){
        var promise = new Promise(function(resolve,reject){
            if(userInfo.length<2)
                reject();
            else
                resolve();

        });
        return promise;
    }
    _login(){
        this._infoHasDone().then(()=>{
            this._getPubKey();
        },()=>{
            console.log("用户名/密码不能为空")
        })
    }
    _navToHome(){
        this.props.navigation.navigate('main');
    }
}
const styles=StyleSheet.create({
      container:{
          flex:1,
          backgroundColor:'#dddddd',
          alignItems:'center'
      },
    iconStyle:{
        marginTop:50,
        marginBottom:30,
        width:80,
        height:80,
        borderRadius:40,
        borderWidth:2,
        borderColor:'white'
    },
    TextInputStyle:{
        height:38,
        width:Dimensions.get('window').width,
        backgroundColor:'white',
        marginBottom:1,
        textAlign:'center'
    },
    loginBtnStyle:{
         height:35,
         width:300,
         backgroundColor:'blue',
         marginTop:30,
         marginBottom:20,
         justifyContent:'center',
         alignItems:'center',
         borderRadius:8
    },
    settingStyle:{
          flexDirection:'row',
          justifyContent:'space-between',
          width:330,
    }

});
