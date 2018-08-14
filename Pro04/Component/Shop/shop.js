import React,{Component}from 'react';
import {StyleSheet, View, Text, ListView, ActivityIndicator, Dimensions,TouchableOpacity, Image} from 'react-native';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
var cacheList = [];
const ds = new ListView.DataSource(
    {
        rowHasChanged: (r1,r2) => r1 !== r2
    }
);
// noinspection JSAnnotator
export default class home extends React.Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            isNoMoreData:false,
            isLoading:false,
            jsonData:[],
            Num:1
        };
        this.pageIndex = 1;
    }
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.headerStyle}>
                    <View style={{marginLeft:20}}>
                       <Text style={{color:'white',fontSize:20}}>我的微淘</Text>
                    </View>
                </View>
                {this.state.jsonData.length ==0? <Text>加载中</Text> :
                    <ListView  contentContainerStyle={styles.listViewStyle} enableEmptySections={true} dataSource={ds.cloneWithRows(this.state.jsonData)}
                               renderRow={(rowData,sectionID,rowID) => this._renderRow(rowData,sectionID,rowID)}
                               renderFooter={this._renderFooter.bind(this)}
                               onEndReached={this._endReached.bind(this)}
                               onEndReachedThreshold={1} />}

            </View>
        );
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
            console.log("第二次获取");
            this._fetchData();
        }
    }
    _renderRow(rowData,sectionID,rowID){

        return(
            <View style={styles.containerViewStyle}>
                <View style={styles.Row_upViewStyle}>
                    <TouchableOpacity activeOpacity={0.5}>
                        <Image style={styles.portraitStyle} source={{uri:'icon_list1'}}/>
                    </TouchableOpacity>
                    <View style={styles.Row_upRightViewStyle}>
                        <Text style={styles.usernameStyle}>{rowData.owner_id}</Text>
                        <Text style={styles.timeStyle}>{rowData.time}</Text>
                    </View>
                </View>
                <View style={styles.Row_downViewStyle}>
                    <Text style={styles.descStyle}>{rowData.sdesc}</Text>
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
    _renderProduct(rowData){
        var imageArray=[];/*组件返回出去*/
        var col;
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
                    <TouchableOpacity  activeOpacity={0.5}>
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
const styles=StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center'
    },
    headerStyle:{
        backgroundColor:'#7274eb',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        width:Width,
        height:Height/12,
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
