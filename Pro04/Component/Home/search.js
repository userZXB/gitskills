import React, { Component } from 'react';
import {StyleSheet, View, TouchableOpacity, TextInput, Text, Dimensions, Image, ListView} from 'react-native';
import {RadioButton, RadioGroup} from "react-native-flexi-radio-button";
var Width = Dimensions.get('window').width;
var Height = Dimensions.get('window').height;
var col;
var searchText;
var lowPrice=0;
var highPrice=0;
var Address = 0;
const url = "http://192.168.137.184:3000/search/";
const ds = new ListView.DataSource(
    {
        rowHasChanged: (r1,r2) => r1 !== r2
    }
);
export default class search extends React.Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            Products:[]
        };
    }
    render(){
        return(
            <View style={styles.containerStyle}>
                {this._renderNavBar()}
                {this._renderFilter()}
                <View >
                    {
                       this.state.Products.length >0 ?
                       this._listView():this._renderLoad()
                    }
                </View>
            </View>
        );
    }
    _renderLoad(){
        return(
            <View style={styles.loadStyle}>
               <Text>loading...</Text>
            </View>
        )
    }
    _renderNavBar(){
        return (
            <View style={styles.navBarStyle}>
                <TouchableOpacity activeOpactiy={0.5} onPress={()=>this._returnHome()}>
                  <View style={styles.returnStyle}>
                    <Image source={{uri:'icon_arrow_left'}} style={styles.iconNavStyle}/>
                  </View>
                </TouchableOpacity>
                <View style={styles.textViewStyle}>
                    <TextInput underlineColorAndroid='transparent' placeholder='搜索商品' style={styles.inputStyle} onChangeText={(text)=>{searchText = text}} />
                </View>
                <TouchableOpacity onPress={() => {this._searchItems()}}>
                   <View style={styles.buttonViewStyle}>
                      <Text style={{fontSize:14,color:'white'}}>搜索</Text>
                   </View>
                </TouchableOpacity>
            </View>
        );
    }
    _returnHome(){
       this.props.navigation.goBack();
    }
    _renderFilter(){
        return(
            <View style={styles.Filter}>
                <View style={styles.priceInputStyle}>
                    <TextInput underlineColorAndroid='transparent' style={styles.priceStyle} placeholder='最低价' onChangeText={(text)=>{this._setLowPrice(text)}} />
                    <Image source={{uri:'icon_arrow_left'}} style={styles.testStyle}/>
                    <TextInput underlineColorAndroid='transparent' style={styles.priceStyle} placeholder='最高价' onChangeText={(text)=>{this._setHighPrice(text)}} />
                </View>
                <View style={styles.buttonStyle}>
                    <RadioGroup size={14} onSelect = {( index,value) => this._onSelectAdd(index, value)}  style={styles.RadioStyle} >
                         <RadioButton value={1} >
                             <Text style={{fontSize:12}}>崂山</Text>
                         </RadioButton>
                         <RadioButton value={2} >
                             <Text style={{fontSize:12}}>鱼山</Text>
                         </RadioButton>
                         <RadioButton value={0}>
                             <Text style={{fontSize:12}}>不限</Text>
                         </RadioButton>
                    </RadioGroup>
                </View>
                <TouchableOpacity activeOpacity={0.5} onPress={()=>{this._setFetch()}}>
                    <View style={styles.setFilter}>
                       <Text>重置</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    _setFetch(){
        this._fetchData();
    }
    _onSelectAdd(index,value){
        Address=`${value}`;
    }
    _setLowPrice(price){
        if(price=='')
            lowPrice=0;
        else
            lowPrice = price;
    }
    _setHighPrice(price){
        if(price=='')
            highPrice = 0;
        else
           highPrice = price;
    }
    _fetchData(){
        var filter;
        if((lowPrice==0)&&(highPrice==0)&&(Address==0))
             filter = "?queryString="+searchText;
        else
             filter = "filter?queryString="+searchText+"&low="+lowPrice+"&high="+highPrice+"&address="+Address;
        var req = new Request(url+filter,{method: 'GET'});
        fetch(req).then((response)=>{
            if(response.ok)
            {
                return response.json();
            }
            else
                console.log("404")
        }).then((jsonData)=>{
            if(jsonData!=null) {
                if (jsonData.code === '0')
                {
                    console.log(jsonData.product);
                    this.setState({ Products:jsonData.product});
                }
                else
                    console.log("database failed");
            }
        }).catch((err)=>{
            console.log(err);
        });
    }
    _searchItems(){
        if(searchText==null){
            console.log('搜索条件不为空');
        }
        else{
           this._fetchData();
        }

    }
    _listView(){
      return(
            <ListView  contentContainerStyle={styles.listViewStyle} enableEmptySections={true} dataSource={ds.cloneWithRows(this.state.Products)}
                       renderRow={(rowData) => this._renderRow(rowData)}/>
        );
    }
    _renderRow(rowData){
        return(
            <View style={styles.containerViewStyle}>
                <View style={styles.Row_upViewStyle}>
                    <TouchableOpacity activeOpacity={0.5}>
                        <Image style={styles.portraitStyle} source={{uri:'icon_portrait1'}}/>
                    </TouchableOpacity>
                    <View style={styles.Row_upRightViewStyle}>
                        <Text style={styles.usernameStyle}>{rowData.owner_id}</Text>
                        <Text style={styles.timeStyle}>{rowData.time}</Text>
                    </View>
                </View>
                <View style={styles.Row_downViewStyle}>
                    <Text style={styles.descStyle}>{rowData.desc}</Text>
                    <View style={styles.outImageStyle}>{this._renderImage(rowData)}</View>
                </View>
            </View>
        );
    }
    componentWillUpdate(){
    }
    _renderImage(rowData){
        var imageArray=[];
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
            console.log("http://192.168.137.184:3000/public/images"+rowData.image[i]);
            imageArray.push(
                <View  key={i}>
                    <TouchableOpacity  activeOpacity={0.5}>
                        <Image source={{uri:"http://192.168.137.184:3000/public/images"+rowData.image[i]}} style={{width:(Width-50-col*5)/(col+1),
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
const styles=StyleSheet.create({
    containerStyle:{
        flex:1,
    },
    navBarStyle:{
        width:Width,
        height:48,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#e5e7f3'
    },
    returnStyle:{
        justifyContent:'center',
        alignItems:'center',
        width:(Width)/5,
        height:37,
    },
    iconNavStyle:{
        width:37,
        height:37
    },
    textViewStyle:{
        borderRadius:12,
        marginLeft:5
    },
    inputStyle:{
        width:(Width*3)/5,
        height:37,
        backgroundColor:'white',
        borderRadius:12,
    },
    buttonViewStyle:{
        width:Width*0.15,
        height:37,
        backgroundColor:'#7274eb',
        justifyContent:'center',
        alignItems:'center',
        flexDirection:"row",
        marginLeft:5,
        borderRadius:15
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
    loadStyle:{
        justifyContent:'center',
        alignItems:'center',
        height:Height-45
    },
    Filter:{
        flexDirection:'row',
        alignItems:'center',
        height:40
    },
    priceInputStyle:{
        flexDirection:'row',
        alignItems:'center',
        marginLeft:8
    },
    priceStyle:{
        width:Width*0.12,
        backgroundColor:'white',
        borderRadius:15,
        height:33,
        fontSize:12,
        marginRight:4
    },
    testStyle:{
        height:25,
        width:25,
        marginRight:5
    },
    buttonStyle:{
        width:Width*0.52,
        height:33,
        backgroundColor:'white',
        borderRadius:15,
        flexDirection:'row',
        alignItems:'center',
    },
    RadioStyle:{
        flexDirection:'row',
        alignItems:'center',
    },
    setFilter:{
        width:Width*0.098,
        backgroundColor:'white',
        height:33,
        alignItems:'center',
        justifyContent:"center",
        marginLeft:2,
        borderRadius:10
    }

});