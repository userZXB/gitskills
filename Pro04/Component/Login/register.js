import React,{Component}from 'react';
import {StyleSheet, View, Image, TextInput, Text, Dimensions, TouchableOpacity, ScrollView} from 'react-native';
import {Icon} from "native-base";
import ActionSheet from 'react-native-actionsheet'
var RSAKey= require('react-native-rsa');
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'
const Width=Dimensions.get('window').width;
var username;
var PhoneNumber;
var gender;
var Address;
var Password;
var Cipher;
var userInfo=[];
var ID;
// noinspection JSAnnotator
export default class Register extends React.Component<Props>{
    constructor(props){
        super(props);
        this.state = {
            gender: '',
            Add:'',
            passID:false,
            failID:false,
            isPhoneNumber:'',
            warning:false,
            portrait:'icon_upload',
            visible: false,
        };
        this._onSelect = this._onSelect.bind(this);
        this._onSelectAdd = this._onSelectAdd.bind(this)
    }
    render(){
        return(
        <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={true}>
            <View style={styles.container}>
                <View style={styles.avatarStyle}>
                    <TouchableOpacity activeOpacity={0.5} onPress={()=>{this.ActionSheet.show()}}>
                      <Image source={{uri:this.state.portrait}} style={styles.uploadStyle} />
                    </TouchableOpacity>
                    <View style={styles.textStyle}>
                      <Text >上传头像</Text>
                    </View>
                </View>
                <View style={styles.idStyle}>
                    <Icon name='person' style={styles.iconStyle}/>
                    <TextInput underlineColorAndroid='transparent' placeholder='用户名'
                               style={styles.inputStyle} maxLength={20} onEndEditing={(event)=>{this._hasID(event.nativeEvent.text);}}/>
                    {this.state.passID == true ? this._IdPass() : null}
                </View>
                <View style={styles.warningStyle}>
                    {this.state.failID == true ? this._IdFailed() : null}
                </View>
                <View style={styles.RadioViewStyle}>
                   <Icon name='person' style={styles.iconStyle}/>
                   <RadioGroup onSelect = {(index,value) => this._onSelect(index, value)}  style={styles.RadioStyle} >
                       <RadioButton value={'M'}>
                           <Text>男</Text>
                       </RadioButton>
                       <RadioButton value={'F'}>
                           <Text>女</Text>
                       </RadioButton>
                   </RadioGroup>
                </View>
                <View style={styles.phoneStyle}>
                    <Icon name='person' style={styles.iconStyle}/>
                    <TextInput underlineColorAndroid='transparent' placeholder='电话号码'
                               style={styles.inputStyle} keyboardType='numeric' onEndEditing={(event)=>{
                                   this._isPhoneNumber(event.nativeEvent.text)
                    }}/>
                </View>
                <View style={styles.warningStyle}>
                   {this._renderNumberFailed()}
                </View>
                <View style={styles.RadioViewStyle}>
                    <Icon name='home' style={styles.iconStyle}/>
                    <RadioGroup onSelect = {( index,value) => this._onSelectAdd(index, value)}  style={styles.RadioStyle} >
                        <RadioButton value={2}>
                            <Text>鱼山</Text>
                        </RadioButton>
                        <RadioButton value={1}>
                            <Text>崂山</Text>
                        </RadioButton>
                    </RadioGroup>
                </View>
                <View style={styles.passwordStyle}>
                    <Icon name='person' style={styles.iconStyle}/>
                    <TextInput underlineColorAndroid='transparent' placeholder='密码/不支持中文'
                               style={styles.inputStyle} secureTextEntry={true} onEndEditing={(event)=>{this._RSA(event.nativeEvent.text)}}/>
                </View>
                <View>
                    <Image/>
                </View>
                <TouchableOpacity activeOpacit={0.5} onPress={()=> {this._PostInfo()}} style={styles.RegButton}>
                    <Text style={{fontSize:20,color:'black'}}>注册</Text>
                </TouchableOpacity>
                <ActionSheet
                        ref={o => this.ActionSheet = o}
                        title={'选取头像'}
                        options={['相机', '相册', '取消']}
                        cancelButtonIndex={2}
                        onPress={(index) => {
                            if(index==0)
                                this._takePhotos();
                            else if(index==1)
                                this._openCropper();
                        }}
                    />
                   </View>
        </ScrollView>
        );
    }
    _takePhotos(){
        /*ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            this.setState({portrait:image.path});
        });*/
    }
    _openCropper(){
        /*调用函数从图库进行选择
        ImagePicker.openPicker({
            cropping: true
        }).then(image => {
            this.setState({portrait:image.path});
        });*/
       /* ImagePicker.openPicker({
            multiple: true
        }).then((images) => {
                console.log(images);
        });*/
    }
    _checkName(text){
        var url="http://192.168.137.184:3000/users/checkuid?u_id=";
        var req = new Request(url+text,{method: 'GET'});
        fetch(req).then((response)=>{
            if(response.ok)
            {
                return response.json();
            }
            else
                console.log("404")
        }).then((jsonData)=>{
            if(jsonData!=null) {
                console.log("打印checkname的返回值");
                console.log(jsonData.code);
                if (jsonData.code === '0')
                {
                    ID = true;
                    this.setState({passID:true});
                    username=text;
                    userInfo.push(username);
                }
                else if (jsonData.code === '1') {
                    this.setState({failID: true});
                    ID = false;
                }
                else
                    console.log("系统错误，请稍后注册");
            }

        }).catch((err)=>{
            console.log(err);
        });
    }/*获取网络请求测试通过,存在即使数据库已经存在名字也会提示通过*/
    _hasID(text){
        this.setState({passID:false,failID:false});
        if(text==='')
            this.setState({passID:false,failID:false});
        else {
            ID = true;
            this._checkName(text);
        }



    }
    _isPhoneNumber(phoneNumber){
        this.setState({isPhoneNumber:false,warning:false});
        if(phoneNumber==='')
            this.setState({isPhoneNumber:false,warning:false});
        else {
            const reg = /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
            if (reg.test(phoneNumber)){
                this.setState({isPhoneNumber: true, warning: false});
                PhoneNumber = phoneNumber;
                userInfo.push(PhoneNumber);
            }
            else
                this.setState({isPhoneNumber: false, warning: true});
        }
    }
    _renderNumberFailed(){
        if(!this.state.isPhoneNumber&&this.state.warning)
            return(
                <Text style={{fontSize:15,color:'red'}}>请注意检查手机号格式</Text>
            )
    }
    _IdPass(){
       return(
           <Image source={require('./image/selected.jpg')} style={{width:20,height:20}}/>
       ) ;
    }
    _IdFailed(){
       return(
               <Text style={{fontSize:15,color:'red'}}>该用户名已存在!</Text>
       );
    }
    _onSelect(index,value){
        gender= `${value}`;
        userInfo.push(gender);
    }
    _onSelectAdd(index,value){
        Address=`${value}`;
        userInfo.push(Address);
    }
    _getPubKey(){
        var url="http://192.168.137.184:3000/users/getkey";
        var req = new Request(url,{method: 'GET'});
        fetch(req).then((response)=>{
            if(response.ok)
                    return response.json();
             else
                 console.log("404")
        }).then((jsonData)=>{
            if(jsonData!=null)
                if(jsonData.code=='0')
                {
                    this._encryt(Password,jsonData.public);
                }
                else
                    console.log("获取密钥失败");
        }).catch((err)=>{
            console.log(err);
        });

    }/*获取网络请求测试成功*/
    _encryt(password,publicKey){
        var rsa = new RSAKey();
        rsa.setPublicString(publicKey);
        Cipher = rsa.encrypt(password);
        console.log(Cipher);
        this._getFormData();
        //this._infoHasDone()
    }
    _RSA(password){
        Password = password;
        userInfo.push(Password);
    }
    _getFormData(){
        let formData = new FormData();
        let file = {uri:this.state.portrait,type:'application/octet-stream',name:'myPortrait.jpg'};
        formData.append("u_id",username);
        formData.append("avatar",file);
        formData.append("u_gender",gender);
        formData.append("Des",Address);
        formData.append("phone_Number",PhoneNumber);
        formData.append("password",Cipher);
        this._fetchRegister(formData);
    }
    _infoHasDone(){
      var promise = new Promise(function(resolve,reject){
          if(userInfo.length<5)
              reject();
          else
             resolve();

      });
        return promise;
    }
    _goToLogin(){
        console.log("注册成功");
        const {navigator}=this.props;
        if (navigator){
            navigator.pop();
        }
    }
    _fetchRegister(formData){
        var url='http://192.168.137.184:3000/users/register';
        console.log("我进去了");
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
                console.log("404");
        }).then((jsonData)=>{
            if(jsonData!=null)
                if(jsonData.code=='0')
                {
                    this._goToLogin();
                }
                else
                {
                    console.log(jsonData.code);
                    console.log("注册失败，请重新注册")
                }

        }).catch((err) => {
            console.log(err);
        })
    }
    _PostInfo() {
        this._infoHasDone().then(()=>{
                 console.log("注册信息完整");
                 this._getPubKey();
        },()=>{
                 console.log("注册信息不完整")
        });

    }
}
const styles=StyleSheet.create({
    contentContainer:{
        flex:1
    },
    container:{
        flex:1,
        backgroundColor:'white',
        alignItems:'center'
    },
    avatarStyle:{
        flexDirection:'row',
        marginTop:100,
        marginBottom:5,
        width:Width*0.87
    },
    uploadStyle:{
        width:70,
        height:70,
        borderWidth:1,
        borderRadius:40,
        borderColor:'gray',
    },
    textStyle:{
        justifyContent:'flex-end',
        marginLeft:5,
        marginBottom:5
    },
    idStyle:{
        width:Width*0.87,
        height:38,
        flexDirection:'row',
        alignItems:'center',
        marginBottom:5,
        borderWidth:1,
        borderColor:'#dddddd'
    },
    iconStyle:{
         marginLeft:2
    },
    inputStyle:{
        width:Width*0.73,
        height:35,
        marginLeft:5,
        fontSize:13
    },
    warningStyle:{
        width:Width*0.87,
        flexDirection:'row',
        alignItems:'center'
    },
    phoneStyle:{
        flexDirection:'row',
        alignItems:'center',
        width:Width*0.87,
        height:38,
        marginBottom:5,
        borderWidth:1,
        borderColor:'#dddddd'
    },
    passwordStyle:{
        flexDirection:'row',
        alignItems:'center',
        width:Width*0.87,
        height:38,
        marginBottom:20,
        borderWidth:1,
        borderColor:'#dddddd'
    },
    RadioStyle:{
        flexDirection:'row',
        alignItems:'center',
    },
    RadioViewStyle:{
        flexDirection:'row',
        alignItems:'center',
        marginBottom:5,
        width:Width*0.87,
        height:38,
        borderWidth:1,
        borderColor:'#dddddd'
    },
    RegButton:{
        width:Width*0.5,
        height:38,
        backgroundColor:'#5b9cfe',
        justifyContent:'center',
        alignItems:'center'
    },
    modalStyle:{
        justifyContent:'flex-end',
        height:90
    },
    textView:{
        width:Width,
        height:45,
        borderWidth:1,
        borderColor:'#1a1e2e',
        backgroundColor:'#1a1e2e'
    }



});
