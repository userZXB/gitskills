import React,{Component}from 'react';
import {StyleSheet, View, Text, ListView, ActivityIndicator, Dimensions,TouchableOpacity, Image} from 'react-native';
var MD5 = require('md5');
const Width = Dimensions.get('window').width;
var Account='冰冰';
var uri;
var Phone_Number='13210830391';
var point=99;
const ds = new ListView.DataSource(
    {
        rowHasChanged: (r1,r2) => r1 !== r2
    }
);
// noinspection JSAnnotator
export default class Activity extends React.Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            jsonData:[],
        };
    }

    /*考虑把商品价格和数量显示出来*/
    componentDidMount(){
        this._getAccountToken();
    }
    render(){
        /*从我的界面进入我的动态界面,不需要传递参数，需要load用户信息*/
        return(
            <View style={styles.container}>
                <View style={styles.headStyle}>
                    <Image style={styles.portraitStyle} source={{uri:'icon_list1'}}/>
                    <View style={styles.Row_RightViewStyle}>
                        <Text style={styles.idStyle}>{Account}</Text>
                        <Text style={styles.phoneStyle}>{Phone_Number}</Text>
                    </View>
                    <View style={styles.pointStyle}>
                        <Text style={{color:'white',fontSize:14}}>{"粉丝数"+point}</Text>
                    </View>
                    <View style={{marginRight:20}}>
                        <TouchableOpacity activeOpacity={0.5} onPress={()=>{this._goToCommunity()}}>
                            <Image style={{width:38,height:38}} source={{uri:'icon_release'}}/>
                        </TouchableOpacity>
                    </View>
                </View>
                {this.state.jsonData.length ==0? <Text>加载中</Text> :
                    <ListView  contentContainerStyle={styles.listViewStyle} enableEmptySections={true} dataSource={ds.cloneWithRows(this.state.jsonData)}
                               renderRow={(rowData,sectionID,rowID) => this._renderRow(rowData,sectionID,rowID)}/>}
            </View>
        );
    }
    _goToCommunity(){
        this.props.navigation.navigate('community', {
            callback: (data) => {
                this.setState({
                    jsonData: data,
                })
            }
        });

    }
    _getAccountToken(){
        storage.load({
            key: 'loginState',
            autoSync: false,
            syncInBackground: false,
        }).then( (ret) => {
            var ProductAPI = "http://192.168.137.132:3000/own_good?u_id=";
            ProductAPI = ProductAPI + ret.account+"&time=";
            var timestamp = new Date().getTime();
            ProductAPI = ProductAPI + timestamp+"&hash=";
            var md5 = MD5(ret.token+timestamp);
            ProductAPI = ProductAPI + md5;
            this._fetchData(ProductAPI);
        }).catch((err) => {
                console.warn(err.message);
                switch (err.name) {
                    case 'NotFoundError':
                        console.log("没有找到");
                        break;
                    case 'ExpiredError':
                        console.log("过期了");
                        break;
                }
            }
        );
    }
    /*获取已经发布的商品信息*/
    _fetchData(ProductAPI){
        var req = new Request(ProductAPI, {method: 'GET'});
        fetch(req).then((response)=>{
            if(response.ok)
                return response.json();
            else
                console.log("404")
        }).then((responseJson)=>{
            if(responseJson.code=='0')
            {
                /*数据获取成功*/
                this.setState({jsonData:responseJson.product});
            }
            else if(responseJson.code=='1')
                console.log("请先登录");
            else if(responseJson.code=='2')
                console.log("数据库错误");
            else
                console.log("请求超时");
        }).catch((error)=>{
            console.log("获取数据时出现了错误");
        });
    }
    /*编辑已经发布的商品信息,把参数传递过去,同时也要传递callback函数*/
    _EditShopItem(rowData){
        this.props.navigation.navigate('community', {
            shopInfo:rowData,
            callback: (data) => {
                this.setState({
                    jsonData: data,
                })
            }
        });
    }
    _DelShopItem(rowData){
       this._getFormData(rowData.id);
    }
    _getFormData(id){
        let formData = new FormData();
        storage.load({
            key: 'loginState',
            autoSync: false,
            syncInBackground: false,
        }).then( (ret) => {
            formData.append("u_id",ret.account);
            formData.append("g_id",id);
            /*获取当前时间戳*/
            var timestamp = new Date().getTime();
            console.log("时间戳");
            console.log(timestamp);
            formData.append("time",timestamp);
            var md5 = MD5(ret.token+timestamp);
            formData.append("hash",md5);
            var url='http://192.168.137.132:3000/own_good/delete';
            this._postData(formData,url);
        }).catch((err) => {
                console.warn(err.message);
                switch (err.name) {
                    case 'NotFoundError':
                        console.log("没有找到");
                        break;
                    case 'ExpiredError':
                        console.log("过期了");
                        break;
                }
            }
        );
    }
    _postData(formData,url){
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
            if(jsonData.code=='0') {
                console.log("success");
                this._getAccountToken();
            }
            else if(jsonData.code=='1')
                console.log("请先登录");
            else if(jsonData.code=='2')
                console.log("数据库出错");
            else
                console.log("加载超时");
        }).catch((err) => {
            console.log(err);
        });

    }
    _renderRow(rowData,sectionID,rowID){
        return(
            <View style={styles.containerViewStyle}>
                <View style={styles.Row_upViewStyle}>
                    <View style={styles.timeStyle}>
                        <Text>{rowData.time}</Text>
                    </View>
                    <View style={styles.NumPriceStyle}>
                        <Text>{"价格"+rowData.price}</Text>
                        <Text>{"数量"+rowData.num}</Text>
                    </View>
                    {/*rowData需要保存用户发布的商品所有信息，传递过去，以编辑*/}
                    <TouchableOpacity activeOpacity={0.5} onPress={()=>{this._EditShopItem(rowData)}}>
                        <View style={styles.EditStyle}>
                            <Text>编辑</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} onPress={()=>{this._DelShopItem(rowData)}}>
                        <View style={styles.DelStyle}>
                            <Text>删除</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.Row_downViewStyle}>
                    <Text style={styles.descStyle}>{rowData.desc}</Text>
                    <View style={styles.outImageStyle}>{this._renderProduct(rowData.image)}</View>
                </View>
            </View>
        );
    }
    _renderProduct(image){
        var imageArray=[];/*组件返回出去*/
        var col;
        if(image.length==1)
            col = 0;
        else if(image.length==2)
            col = 1;
        else if(image.length==4)
            col = 1;
        else
            col = 2;
       /*少一个自动换行*/
        for(var i=0;i<image.length;i++)
        {
            imageArray.push(
                <View  key={i} style={{flexDirection:'row'}}>
                    <TouchableOpacity  activeOpacity={0.5}>
                        <Image source={{uri:'icon_list2'}} style={{width:(Width-50-col*3)/(col+1),
                            height:(Width-50-col*3)/(col+1),
                            marginRight:3,
                            marginTop:3}}/>
                    </TouchableOpacity>
                </View>
            );
        }
        return imageArray;
    }
}
const styles=StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center'
    },
    headStyle:{
        height:49,
        width:Width,
        flexDirection:'row',
        backgroundColor:'#7274eb'
    },
    portraitStyle:{
        width:40,
        height:40,
        borderRadius:12,
        marginLeft:10,
        marginTop:5,
        marginBottom:2
    },
    Row_RightViewStyle:{
        marginLeft:10,
        justifyContent:'flex-end'
    },
    idStyle:{
        fontSize:14,
        color:'white'
    },
    phoneStyle:{
        fontSize:10,
        color:'white'
    },
    pointStyle:{
        justifyContent:'flex-end',
        marginLeft:110,
        marginBottom:5
    },
    listViewStyle:{
        marginTop:10,
        marginLeft:10,
        marginRight:10,
        backgroundColor:'white'
    },
    containerViewStyle:{
        borderBottomWidth:0.5,
        borderBottomColor:'gray',
        marginTop:3,
        padding:10

    },
    Row_upViewStyle:{
          flexDirection:'row',
    },
    timeStyle:{

    },
    NumPriceStyle:{

    },
    EditStyle:{

    },
    DelStyle:{

    },
    Row_downViewStyle:{
        marginTop:3
    },
    descStyle:{
        padding:5
    },
});