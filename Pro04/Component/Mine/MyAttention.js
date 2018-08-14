import React,{Component}from 'react';
import {StyleSheet, View, Text, ListView,Dimensions,TouchableOpacity, Image} from 'react-native';
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
const ds = new ListView.DataSource(
    {
        rowHasChanged: (r1,r2) => r1 !== r2
    }
);
// noinspection JSAnnotator
export default class MyAttention extends React.Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            jsonData:[],
        };
    }
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.headerStyle}>
                    <View style={{marginLeft:10,marginRight:20}}>
                        <TouchableOpacity activeOpacity={0.5} onPress={ ()=>{this.props.navigation.goBack()}}>
                            <Text style={{fontSize:18}}>返回</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{color:'white',fontSize:18}}>我的关注</Text>
                </View>
                {this.state.jsonData.length ==0? <Text>加载中</Text> :
                    <ListView  contentContainerStyle={styles.listViewStyle} enableEmptySections={true} dataSource={ds.cloneWithRows(this.state.jsonData)}
                               renderRow={(rowData) => this._renderRow(rowData)}/>}
            </View>
        );
    }
    componentWillMount() {
        this._fetchData();
    }
    _fetchData(){
        var ProductAPI = "http://192.168.137.194:3000/attention/select?u_id=app";
        var req = new Request(ProductAPI, {method: 'GET'});
        fetch(req).then((response)=>{
            console.log(response);
            if(response.ok)
                return response.json();
            else
                console.log("404")
        }).then((responseJson)=>{
            if(responseJson.code=='0')
            {
                this.setState({jsonData:responseJson.persons});
            }
            else if(responseJson.code=='1')
                console.log("数据库错误");
        }).catch((error)=>{
            console.log("获取数据时出现了错误");
        });
    }
    _renderRow(rowData){
        return(
            <View style={styles.containerViewStyle}>
               <TouchableOpacity activeOpacity={0.5} style={styles.Row_ViewStyle} onPress={()=>{this._goToAttentionHome(rowData)}}>
                       <Image style={styles.portraitStyle} source={{uri:'icon_list1'}}/>
                        <View style={styles.Row_RightViewStyle}>
                             <Text style={styles.usernameStyle}>{rowData.id}</Text>
                             <Text style={styles.timeStyle}>{rowData.Des}</Text>
                        </View>
              </TouchableOpacity>

                <View style={styles.delButtonStyle}>
                    <TouchableOpacity activeOpacity={0.5} onPress={()=>{this._cancelAttention(rowData.id)}} >
                        <Text style={{fontSize:14}}>取关</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    _goToAttentionHome(rowData){
        this.props.navigation.navigate('attentionHome', {
            shopInfo: rowData,
        });
    }
    _cancelAttention(id){

        var url = "http://192.168.137.194:3000/attention/delete?u_id=app&be_id="+id;
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
            if(jsonData.code=='0') {
                this._fetchData();
            }
            else
                console.log("数据库出错");

        }).catch((err) => {
            console.log(err);
        });
    }
}
const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    headerStyle:{
        height:Height/15,
        width:Width,
        backgroundColor:'#7274eb',
        flexDirection:'row',
        alignItems:'center'
    },
    listViewStyle:{
        marginTop:5,
        marginLeft:10,
        marginRight:10,
        backgroundColor:'white'
    },
    containerViewStyle:{
        borderBottomWidth:0.5,
        borderBottomColor:'gray',
        width:Width,
        flexDirection:'row',
        justifyContent:'center'
    },

    Row_ViewStyle:{
        flexDirection:'row',
        width: Width,
        flex:1
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
    usernameStyle:{
        fontSize:14
    },
    timeStyle:{
        fontSize:10
    },
    delButtonStyle:{
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#8efef2',
        marginRight:18,
        marginTop:10,
        width:40,
        height:25,
        borderColor:'gray',
        borderWidth:0.5,
        borderRadius:10
    }

});