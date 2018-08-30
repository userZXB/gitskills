import React,{Component}from 'react';
import {StyleSheet, View, Text, ListView, ActivityIndicator, Dimensions,TouchableOpacity, Image} from 'react-native';
const Width = Dimensions.get('window').width;
var cacheList = [];
const ds = new ListView.DataSource(
    {
        rowHasChanged: (r1,r2) => r1 !== r2
    }
);
/*该页面用于呈现被关注的用户的界面*/
// noinspection JSAnnotator
export default class AttentionHome extends React.Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            jsonData:[],
            attention:false,
            isRefreshing: false,
            isNoMoreData:false,
            isLoading:false,
        };
    }
    /*此处需要把参数传递过去，从服务器获取数据判断是否已经关注此人*/
    componentWillMount(){
        const { params } = this.props.navigation.state;
        this._hasAttention("app");
    }
    _hasAttention(id){
        var ProductAPI = "http://192.168.137.194:3000/attention/select?u_id=app";
        var req = new Request(ProductAPI, {method: 'GET'});
        fetch(req).then((response)=>{
            if(response.ok)
                return response.json();
            else
                console.log("404")
        }).then((responseJson)=>{
            if(responseJson.code=='0')
            {
                let arr = responseJson.persons;
                let arrID = [];
                for(var i=0;i<arr.length;i++)
                    arrID.push(arr[i].id)
                console.log(arrID);
                console.log(arrID.indexOf(id)!=-1);
                if(arrID.indexOf(id)!=-1)
                {
                    this.setState({attention:true});
                }
            }
        }).catch((error)=>{
            console.log("获取数据时出现了错误");
        });
    }
    _addAttention(id){
        var url = "http://192.168.137.194:3000/carrier/insert?u_id=app&"+"be_id="+id;
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
                    this.setState({attention:true})
                }
                else
                    console.log("数据库出错");

        }).catch((err) => {
            console.log(err);
        });

    }
    render(){
        const { params } = this.props.navigation.state;
        return(
            <View style={styles.container}>
                <View style={styles.headStyle}>
                    <Image style={styles.portraitStyle} source={{uri:'icon_list1'}}/>
                    <View style={styles.Row_RightViewStyle}>
                        <Text style={styles.idStyle}>{params.shopInfo.id}</Text>
                        <Text style={styles.phoneStyle}>{params.shopInfo.phone_Number}</Text>
                    </View>
                    <View style={styles.pointStyle}>
                        <Text style={{color:'white',fontSize:14}}>{"粉丝数"+params.shopInfo.point}</Text>
                    </View>
                    <View style={styles.stateStyle}>
                        {this.state.attention ? <Text style={{color:'white',fontSize:14}}>已关注</Text>
                         :<TouchableOpacity activeOpacity={0.5} onPress={()=>{this._addAttention("app")}}>
                            <Text style={{color:'white',fontSize:14}}>关注</Text>
                          </TouchableOpacity>}
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
        justifyContent:'center',
        alignItems:'center'
    },
    headStyle:{
        height:45,
        width:Width,
        flexDirection:'row',
        backgroundColor:'#7274eb'
    },
    portraitStyle:{
        width:40,
        height:40,
        borderRadius:12,
        marginLeft:5,
        marginTop:5,
        marginBottom:2
    },
    Row_RightViewStyle:{
        marginLeft:6,
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
        marginLeft:130,
        marginBottom:5
    },
    stateStyle:{
        marginRight:6,
        justifyContent:'flex-end',
        marginLeft:5,
        marginBottom:5,
        borderColor:'gray',
        borderRadius:12
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