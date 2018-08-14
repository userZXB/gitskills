/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    Container,  Content, Text, Icon,View,
} from 'native-base';
import Swiper from 'react-native-swiper'
import {
    Platform,
    StyleSheet,
    Dimensions,
    ListView,
    Alert,
    TouchableHighlight,
    Image,
    TextInput,  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import Search from './search'
import Viewer from '../ImageView/viewer'
const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const ds = new ListView.DataSource(
    {
        rowHasChanged: (r1,r2) => r1 !== r2
    }
);
var Width = Dimensions.get('window').width;
var Height = Dimensions.get('window').height;
var col;
var cacheList=[];
var imageParams=[{url:"https://avatars2.githubusercontent.com/u/7970947?v=3&s=460",freeHeight: true}];
// noinspection JSAnnotator
export default class home extends React.Component<Props> {
 constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            isNoMoreData:false,
            isLoading:false,
            swiperShow: false,
            jsonData:[],
            advertisements: [
                {
                    image: require('./Advertise/image01.jpg')
                }, {
                    image: require('./Advertise/image02.jpg')
                }, {
                    image: require('./Advertise/image03.jpg')
                }
            ],
        };
    }
    componentWillMount() {
        setTimeout(() => {
            this.setState({swiperShow: true})
        }, 5);
    }
    componentDidMount() {
         this._fetchData();
    }
    _fetchData(){
        this.setState({ isLoading: true });
        var ProductAPI = "http://192.168.137.194:3000/community?u_id=app&page=1";
        var req = new Request(ProductAPI, {method: 'GET'});
        fetch(req).then((response)=>{
            if(response.ok)
                return response.json();
            else
                console.log("404")
        }).then((responseJson)=>{
            if(responseJson.code=='0')
            {
                if(responseJson.products.length < 10) {
                    this.setState({isNoMoreData: true});
                }
                var arr=[];/*保留处理后的数据*/
                for(var i=0;i<responseJson.products.length;i++)
                {
                    let shopObj= responseJson.products[i];
                    shopObj.quantity=1;
                    arr.push(shopObj);
                }
                cacheList = cacheList.concat(arr);/*意味着保留上一次获取的数据，相当于查看已经加载出来的数据*/
                this.setState({jsonData:cacheList});
                this.pageIndex=this.pageIndex+1;
                this.setState({isLoading: false});
            }
            else if(responseJson.code=='1')
                console.log("操作失败");
        }).catch((error)=>{
            console.log("获取数据时出现了错误");
        });
    }
    render() {
        return (
            <Container style={styles.MaxStyle}>
                {this._renderNavBar()}
                <Content>
                    <View style={styles.advertisement}>
                        {
                            this.state.swiperShow == true ?
                                this._renderSwiper() : null
                        }
                    </View>
                    {this._renderListView()}
                </Content>
            </Container>
        );
    }
    _renderListView(){
       return(
               <ListView  contentContainerStyle={styles.listViewStyle} enableEmptySections={true} dataSource={ds.cloneWithRows(this.state.jsonData)}
                renderRow={(rowData,sectionID,rowID) => this._renderRow(rowData,sectionID,rowID)}
                renderFooter={this._renderFooter.bind(this)}
                onEndReached={this._endReached.bind(this)}
                onEndReachedThreshold={1} />
           );

   }
    _renderFooter(){
          if(this.state.isNoMoreData)
              return (
              <View style={{marginVertical:20}}>
                  <Text style={{fontSize:14,color:'#000000',textAlign:'center'}}>没有更多数据啦...</Text>
              </View>);
          if(this.state.isLoading)
          {
              return (<ActivityIndicator style={{ marginVertical:20 }}/>);
          }

    }
    _endReached(){
       if(!this.state.isLoading) {
           this._fetchData();
       }
   }
    _renderNavBar() {
        return (
            <View style={styles.navBarStyle}>
              <View style={styles.searchBarStyle}>
                  <Icon name='ios-search-outline' style={styles.iconNavStyle}/>
                  <TextInput underlineColorAndroid='transparent' placeholder='搜索商品' style={styles.inputStyle} onFocus={()=>{this._goToSearch()}}/>
              </View>
              <View style={styles.rightNavViewStyle}>
                  <TouchableOpacity onPress={() => {
                        alert('点击了')
                  }}>
                      <Icon name='menu' style={styles.navStyle}/>
                  </TouchableOpacity>
              </View>
            </View>
        );
    }
    _goToSearch(){
        this.props.navigation.navigate('search');
    }
    _renderSwiper() {
        return (
            <Swiper loop={true} height={190} autoplay={true} autoplayTimeout={5} paginationStyle={{bottom: 5}}>
                {
                    this.state.advertisements.map((advertisement,
                                                   index) => {
                        return (
                            <TouchableHighlight key={index}
                                                onPress={() =>
                                                    Alert.alert('你单击了轮播图', null, null)}>
                                <Image style={styles.advertisementContent}
                                       source={advertisement.image}>
                                </Image>
                            </TouchableHighlight>
                        );
                    })}
            </Swiper>
        );
    }
    _renderRow(rowData,sectionID,rowID){
        return(
            <View style={styles.containerViewStyle}>
                <View style={styles.Row_upViewStyle}>
                    <TouchableOpacity activeOpacity={0.5}>
                        <Image style={styles.portraitStyle} source={{uri:'icon_list1'}}/>
                    </TouchableOpacity>
                    <View style={styles.Row_upRightViewStyle}>
                        <Text style={styles.usernameStyle}>{rowData.username}</Text>
                        <Text style={styles.timeStyle}>{rowData.time}</Text>
                    </View>
                </View>
                <View style={styles.Row_downViewStyle}>
                    <Text style={styles.descStyle}>{rowData.desc}</Text>
                    <View style={styles.outImageStyle}>{this._renderProduct(rowData)}</View>
                </View>
                <View style={styles.CartViewStyle}>
                    <View style={styles.selectNum}>
                        <Text>购买数量</Text>
                        <TouchableOpacity onPress={() => this._minus(rowID)}>
                            <Image source={{uri:'icon_shopping_minus'}} style={styles.checkBox}/>
                        </TouchableOpacity>
                        <Text style={{width: 30, textAlign: 'center'}}>{rowData.quantity}</Text>
                        <TouchableOpacity onPress={() => this._add(rowID)}>
                            <Image source={{uri:'icon_shopping_plus'}} style={styles.checkBox} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.shoppingButtonStyle}>
                        <TouchableOpacity activeOpacity={0.5} onPress={()=>{this._addToCart(rowData.id,rowData.num)}}>
                            <Text>加入购物车</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
    _minus(ID){
        var arr = this.state.jsonData;
        var quantity = arr[ID].quantity;
        if(quantity>1)
        {
            arr[ID].quantity = quantity-1;
            this.setState({jsonData:arr});
        }


    }
    _add(ID){
        var arr = this.state.jsonData;
        var quantity = arr[ID].quantity;
        var inventory = arr[ID].num;
        if(quantity<inventory)
        {
            arr[ID].quantity = quantity+1;
            this.setState({jsonData:arr});
        }
    }
    _addToCart(id,num){
        var url = "http://192.168.137.194:3000/carrier/insert?u_id=app&"+"g_id="+id+"&num="+num;
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type":"application/x-www-form-urlencoded"
            },
        }).then((res) =>{
            if(res.ok)
                return res.json();
            else
                console.log("404")
        }).then((jsonData)=>{
            if(jsonData!=null)
                if(jsonData.code=='0') {
                    alert("success");
                }
                else
                    console.log("数据库出错");

        }).catch((err) => {
            console.log(err);
        });

    }
    _ImageView(index){
        const {navigator}=this.props;
        if (navigator){
            navigator.push({
                name:'viewer',
                component:Viewer,
                params:{
                    images:imageParams,
                    indexNum:index
                    }
               });
        }
    }
    _renderProduct(rowData){
        var imageArray=[];
        imageParams=[];
       if(rowData.image.length==1)
          col = 0;
       else if(rowData.image.length==2)
          col = 1;
       else if(rowData.image.length==4)
          col = 1;
       else
          col = 2;
       for(var i=0;i<rowData.image.length;i++)
       {
           imageArray.push(
             <View  key={i}>
               <TouchableOpacity  activeOpacity={0.5} onPress={()=>{this._ImageView()}}>
                  <Image source={{uri:'icon_list2'}} style={{width:(Width-50-col*5)/(col+1),
                      height:(Width-50-col*5)/(col+1),
                      marginRight:3,
                      marginTop:3}}/>
               </TouchableOpacity>
             </View>
           );
       }
        return imageArray;
    }
}

const styles = StyleSheet.create({
    MaxStyle:{
        backgroundColor:'#f0eced'
    },
    navBarStyle:{
        height:Height/13,
        width:Width,
        backgroundColor:'#7274eb',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    searchBarStyle:{
        flexDirection:'row',

        borderWidth:1,
        borderColor:'gray',
        borderRadius:12,
        marginLeft:18,
        backgroundColor:'#e5e7f3'
    },
    iconNavStyle:{
        width:Width/16,
        height:Width/16,
        marginLeft:3,
        marginTop:3
    },
    inputStyle:{
        width:(Width*8)/12,
        height:37,
        backgroundColor:'#e5e7f3',
        borderRadius:12,
    },
    rightNavViewStyle:{
        height:35,
        marginRight:10,
    },
    navStyle:{
        width:40,
        height:50,
        alignItems:'center'
    },
    advertisementContent:{
        width:Dimensions.get('window').width,
        height:(Height*3)/13
    },
    advertisement: {
        height: (Height*3)/13
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
       marginTop:10,
       padding:10

    },
    Row_upViewStyle:{
         flexDirection:'row'
    },
    portraitStyle:{
         width:40,
         height:40,
         borderRadius:12,
         marginLeft:5
    },
    Row_upRightViewStyle:{
        marginLeft:10,
        justifyContent:'flex-end'
    },
    usernameStyle:{
         fontSize:14
    },
    timeStyle:{
        fontSize:10
    },
    Row_downViewStyle:{
        marginTop:3
    },
    descStyle:{
         padding:5
    },
    outImageStyle:{
        // 设置侧轴的对齐方式
        flexDirection:'row',
        flexWrap:'wrap',
    },
    checkBox: {
    width: 20,
        height: 20,
    },
    CartViewStyle:{
    flexDirection:'row'
   },
   selectNum:{
    flexDirection:'row'
   },
    shoppingButtonStyle:{
    backgroundColor:'#7274eb'
   }
});
