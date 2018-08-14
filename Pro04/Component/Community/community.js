import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Easing,
    TouchableOpacity,
    Dimensions,
    PanResponder,
    Animated, Text, TextInput, ScrollView
} from 'react-native';
var MD5 = require('md5');
/*无法实现删除与调整位置同时进行*/
import SYImagePicker from 'react-native-syan-image-picker'
const {width} = Dimensions.get('window');
const Height = Dimensions.get('window').height;
const delHeight = 30;
const margin = 10;
const col = 4;
var path=[];
const imageSize = (width-(col+1)*10)/4;
const httpAdd = "http://192.168.137.132:3000/";
/*该测试用例，尺寸简单粗暴，用于实验是否可以准确移动*/
/*直接用状态控制组件是否显示，不能间接控制*/
// noinspection JSAnnotator
export default class App extends React.Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            photos: [],
            showDelModal: false,
            delText: '拖拽此处可以删除',
            itemName:'',
            itemPrice:'',
            itemNum:'',
            itemDetail:'',
            DelWidth:width-60,
            DelHeight:35
        };
        this.items=[];
        this.slideAniValue = new Animated.Value(-60);
    }
/*绝对布局是相对于父容器而言吧，我也是很无奈*/
    _getDistanceValueYById(id){
        const height = (Height)*31/65;
        var left;
        var top;
        if(id==0||id==4||id==8)
        {
            left = margin;
            top = height+(id/col)*(margin+imageSize);
        }
        else if(id==1||id==5)
        {
            top = height+((id-1)/col)*(margin+imageSize);
            left =2*margin+imageSize;
        }
        else if(id==2||id==6)
        {
            top = height+((id-2)/col)*(margin+imageSize);
            left = 2*(margin+imageSize)+margin;
        }
        else if(id==3||id==7){
            top = height+((id-3)/col)*(margin+imageSize);
            left = 3*(margin+imageSize)+margin;
        }
        return {top,left};
    }
    _getIdByPosition(pageX,pageY){
        const {photos}=this.state;
        var id = -1;
        const height = (Height)*31/65;/*上方留的高度*/
        if(pageY >=height && pageY<(height+imageSize+margin))
            if(pageX>=margin && pageX <(2*margin+imageSize))
                id = 0;
            else if(pageX>=(2*margin+imageSize) && pageX <=(3*margin+2*imageSize))
            {
                if(photos.length<2)
                    id = -1;
                else
                    id = 1
            }
            else if(pageX>(3*margin+2*imageSize) && pageX <=(4*margin+3*imageSize))
            {
                if(photos.length<3)
                    id = -1;
                else
                    id = 2;
            }
            else
                if(photos.length<4)
                    id = -1;
                else
                    id = 3;

        else if(pageY >=(height+imageSize+margin) && pageY<(height+2*imageSize+2*margin))
            if(pageX>=margin && pageX <(2*margin+imageSize))
                if(photos.length<5)
                    id = -1;
                else
                    id = 4;
            else if(pageX>=(2*margin+imageSize) && pageX <=(3*margin+2*imageSize))
                if(photos.length<6)
                    id = -1;
                else
                    id = 5;
            else if(pageX>(3*margin+2*imageSize) && pageX <=(4*margin+3*imageSize))
            {
                if(photos.length<7)
                    id = -1;
                else
                    id = 6;
            }
            else
                if(photos.length<8)
                   id = -1;
                else
                   id = 7;
        else if(pageY>=(height+2*imageSize+2*margin)&& pageY<(height+3*imageSize+2*margin))
            if(pageX>=margin && pageX <(2*margin+imageSize))
                if(photos.length<9)
                    id = -1;
                else
                    id = 8;
        return id;
    }
    _setState(path){
        console.log(path);
        const {params} = this.props.navigation.state;
        var numString = params.shopInfo.num.toString();
        var priceString = params.shopInfo.price.toString();
        this.name=params.shopInfo.name;
        this.price=priceString;
        this.Num=numString;
        this.detail=params.shopInfo.desc;
        this.goodId=params.shopInfo.id;
        this.setState({photos: path,
            itemName:params.shopInfo.name,
            itemPrice:priceString,
            itemNum:numString,
            itemDetail:params.shopInfo.desc});
    }
    _handleImage(params){
        var promise = new Promise(function(resolve,reject){
            for(var i=0;i<params.shopInfo.image.length;i++)
                path.push(httpAdd+"images/"+params.shopInfo.image[i]);
            if(path.length>0)
                resolve(path);
            else{
                reject();
            }

        });
        return promise;
    }
    componentWillMount(){
        /*得判断是不是有参数传递过来,该参数时一个json对象*/
        const {params} = this.props.navigation.state;
        /*因为两个页面传递都有参数，因此都会进去这个条件，因此会报错*/
        /*如果为空说明不是重新编辑商品信息，否则重新编辑商品信息,重新编辑商品信息的时候，照片此时直接是一个路径数组
        * 但是，首次选择，照片此时是含有路径的json数组*/
        if(params.hasOwnProperty("shopInfo"))
        {/*if语句的作用从原来的状态重新编辑*/
            this._handleImage(params).then((path)=>{
                this._setState(path);
            },()=>{console.log("处理失败")});

        }
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {
                this.setState({DelWidth:0,DelHeight:0});
                const {pageX,pageY, locationX,locationY} = evt.nativeEvent;
                this.preY = pageY - locationY;/*表示在此函数内部生成此变量*/
                this.preX = pageX - locationX;
                //get the taped item and highlight it
                this.index = this._getIdByPosition(pageX, pageY);
                let item = this.items[this.index];
                item.setNativeProps({/*设置突出点击的效果*/
                    style: {
                        shadowColor: "#000",
                        shadowOpacity: 0.3,
                        shadowRadius: 5,
                        shadowOffset: {height: 0, width: 2},
                        elevation: 5
                    }
                });
                this.setState({
                    showDelModal: true
                });

                // 删除区域出来
                // this.slideAniValue.setValue(-60);
                Animated.timing(this.slideAniValue, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.linear,// 线性的渐变函数
                }).start();



            },
            onPanResponderMove: (evt, gestureState) => {
                /*作用是肉眼可以看得出来移动位置了*/
                let top = this.preY + gestureState.dy;
                let left = this.preX + gestureState.dx;
                let item = this.items[this.index];
                item.setNativeProps({
                    style: {top: top,left:left}
                });
                if(top >= (Height-delHeight-imageSize)){ // 图片进入删除区域
                    this.setState({
                        delText: '松开删除',
                    });

                }else{
                    this.setState({
                        delText: '拖拽此处可以删除'
                    })
                }
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                this.setState({
                    showDelModal: false
                });
                Animated.timing(this.slideAniValue, {
                    toValue: -60,
                    duration: 300,
                    easing: Easing.linear,// 线性的渐变函数
                }).start();
                if(this.state.delText == '松开删除'){
                    this._delImage(this.index);
                }else{
                    const shadowStyle = {
                        shadowColor: "#000",
                        shadowOpacity: 0,
                        shadowRadius: 0,
                        shadowOffset: {height: 0, width: 0},
                        elevation: 0
                    };
                    let item = this.items[this.index];
                    //go back the correct position
                    item.setNativeProps({
                        style: {
                            ...shadowStyle,
                            top: this._getDistanceValueYById(this.index).top,
                            left: this._getDistanceValueYById(this.index).left
                        }
                    });
                }

                /*如果是松开删除，就要执行图片删除动作，否则，回到交换位置处的原处*/
            },
            onPanResponderTerminate: (evt, gestureState) => {
                // Another component has become the responder, so this gesture
                // should be cancelled
                console.log("当前组件手势取消")
            }
        });
    }
    _delImage(index){
        let cacheData = this.state.photos;
        cacheData.splice(index,1);//index已经是调整过后的索引位置，因此可以直接删除
        this.setState({
            photos: cacheData
        });
        this.items[index].setNativeProps({
            style: {
                left: this._getDistanceValueYById(index).left,
                top: this._getDistanceValueYById(index).top
            }
        })
    }
    handleOpenImagePicker = () => {
        var arr = [];/*做了修改，此时arr只保存照片的uri*/
        /* var length = 9-this.state.photos.length;动态实现控制照片数量*/
        /* SYImagePicker.removeAllPhoto();该句用于实现第一次选择的全部清楚，不在第二次选择框中呈现*/
        SYImagePicker.showImagePicker({imageCount: 9, isRecordSelected: true}, (err, photos) => {
            if (!err) {
                for(var i=0;i<photos.length;i++)
                    arr.push(photos[i].uri);
                this.setState({
                    photos: [...this.state.photos,...arr]
                })
            }
        })
    };
    /**
     * 使用方式sync/await
     * 相册参数暂时只支持默认参数中罗列的属性；
     * @returns {Promise<void>}
     */
    _selectPhoto(){
        return(
            <View style={{width:imageSize,height:imageSize, position:'absolute',
                left:this._getDistanceValueYById(this.state.photos.length).left,
                top: this._getDistanceValueYById(this.state.photos.length).top}}>
                <TouchableOpacity onPress={this.handleOpenImagePicker}>
                    <Image style={{width: imageSize, height: imageSize}}
                           source={{uri:'icon_dynamic'}}/>
                </TouchableOpacity>
            </View>
        );
    }
    /*有一个问题如果我没有编辑某个文本框会出错，因为没有调用此函数*/
    _ItemName(text){
        this.name = text;
    }
    _ItemPrice(text){
        this.price = text;
    }
    _ItemNum(text){
        this.Num = text;
    }
    _ItemDetail(text){
        this.detail = text;
    }
    _goToShop(){
        this.props.navigation.goBack();
    }
    _getFormData(){
        let formData = new FormData();
        storage.load({
            key: 'loginState',
            autoSync: false,
            syncInBackground: false,
        }).then( (ret) => {
            formData.append("u_id",ret.account);
            /*获取当前时间戳*/
            var timestamp = new Date().getTime();
            console.log("时间戳");
            console.log(timestamp);
            formData.append("time",timestamp);
            console.log("解密后的token");
            console.log(ret.token);
            var md5 = MD5(ret.token+timestamp);
            console.log("md5值");
            console.log(md5);
            formData.append("hash",md5);
            formData.append("price",this.price);
            formData.append("name",this.name);
            formData.append("desc",this.detail);
            formData.append("num",this.Num);
            const photos= this.state.photos;
            for(var i = 0;i<photos.length;i++){
                let file = {uri: photos[i], type: 'application/octet-stream', name: 'myPortrait.jpg'};
                formData.append("picture",file);
            }
            var url='http://192.168.137.132:3000/own_good/add';
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
    _getFormDataUpdate(){
        let formData = new FormData();
        storage.load({
            key: 'loginState',
            autoSync: false,
            syncInBackground: false,
        }).then( (ret) => {
            formData.append("u_id",ret.account);
            /*获取当前时间戳*/
            formData.append("g_id",this.goodId);
            console.log("商品的id是"+this.goodId);
            var timestamp = new Date().getTime();
            formData.append("time",timestamp);
            var md5 = MD5(ret.token+timestamp);
            formData.append("hash",md5);
            formData.append("price",this.price);
            formData.append("name",this.name);
            formData.append("desc",this.detail);
            formData.append("num",this.Num);
            const photos= this.state.photos;
            for(var i = 0;i<photos.length;i++){
                let file = {uri: photos[i], type: 'application/octet-stream', name: 'myPortrait.jpg'};
                formData.append("picture",file);
            }
            var url = 'http://192.168.137.132:3000/own_good/update';
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
                console.log(jsonData.code);
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
    /*在这里获得账号等信息是为了更新我的动态，需要调用callback函数*/
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
               const {state} = this.props.navigation;
               state.params.callback(responseJson.product);
               this.props.navigation.goBack();
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
    _releaseItems(){
       const {params} = this.props.navigation.state;
       if(params.hasOwnProperty("shopInfo"))
       {
           console.log("更新");
           this._getFormDataUpdate();
       }

       else
       {
           console.log("发布");
           this._getFormData();
       }

    }
     render() {
      const {photos} = this.state;/*获取商品*/
        return (
            <View style={styles.container}>
                <View style={styles.headerStyle}>
                    <View style={{marginLeft:20}}>
                      <TouchableOpacity activeOpacity={0.5} onPress={()=>{this._goToShop()}}>
                          <Image style={{width:38,height:38}} source={{uri:'icon_release'}}/>
                      </TouchableOpacity>
                    </View>
                    <View style={{marginRight:20}}>
                      <Text style={{color:'white',fontSize:18}}>发布商品</Text>
                    </View>
                </View>
                <View style={styles.inputGroupStyle}>
                    <TextInput  placeholder='商品名字' defaultValue={this.state.itemName}
                               style={styles.shopItemsStyle} maxLength={20} onChangeText={(text)=>{this._ItemName(text);}}/>
                    <TextInput  placeholder='商品价格' defaultValue={this.state.itemPrice}
                               style={styles.shopItemsStyle} maxLength={20} onChangeText={(text)=>{this._ItemPrice(text);}}/>
                    <TextInput  placeholder='商品数量' defaultValue={this.state.itemNum}
                                style={styles.shopItemsStyle} maxLength={20} onChangeText={(text)=>{this._ItemNum(text);}}/>
                    <TextInput  placeholder='商品详细描述'  defaultValue={this.state.itemDetail} multiline={true}
                                underlineColorAndroid='transparent'
                                style={styles.shopDetailsStyle} onChangeText={(text)=>{this._ItemDetail(text);}}/>
                </View>

                {photos.map((photo, index) => {
                        let source = {uri: photo}; /*此时不需要从中取uri*/
                        if (photo.enableBase64) {
                            source = {uri: photo.base64};
                        }
                        /*只能在最外层使用绝对布局,不适用绝对布局，无法正常移动*/
                        return (
                            <View {...this._panResponder.panHandlers} ref={(ref) => {this.items[index] = ref;}}
                                  key={index} style={{width:imageSize,height:imageSize,position:'absolute',
                                  top:this._getDistanceValueYById(index).top,left:this._getDistanceValueYById(index).left}}
                            >
                                <Image style={{width: imageSize, height: imageSize}}
                                       source={source}
                                />
                            </View>
                        )
                })}
                {this.state.photos.length <9 ? this._selectPhoto(): null}

                <Animated.View style={[styles.delWraper, {bottom: this.slideAniValue}]}>
                    <Text style={{color: '#fff'}}>{this.state.delText}</Text>
                </Animated.View>
                {
                    this.state.showDelModal &&
                    <View style={styles.shadowModal}/>
                }
                <View style={[styles.releaseButton,{width:this.state.DelWidth, height:this.state.DelHeight}]}>
                   <TouchableOpacity activeOpacity={0.5} onPress={()=>{this._releaseItems()}} >
                      <Text style={{color:'white',fontSize:18}}>确定发布</Text>
                   </TouchableOpacity>
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#F5FCFF'
    },
    headerStyle:{
        backgroundColor:'#7274eb',
        flexDirection:'row',
        alignItems:'center',
        width:width,
        height:Height/13,
        justifyContent:'space-between'
    },
    inputGroupStyle:{
        width:width,
        alignItems:'center',
        height:(Height*2)/5,
    },
    shopItemsStyle:{
        width:width-20,
        height:40
    },
    shopDetailsStyle:{
        width:width-20,
    },
    issueGoods:{
        width:width,
        height:imageSize,
    },
    delWraper:{
        width: width,
        height: delHeight,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        position: 'absolute',
    },
    shadowModal:{
        width: width,
        height: Height,
        position: 'absolute',
        backgroundColor: '#000',
        opacity: 0.4,
        bottom: 0,
        left: 0,
    },
    releaseButton:{
        backgroundColor:'#7274eb',
        marginLeft:30,
        top:265,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:12

    }

});
