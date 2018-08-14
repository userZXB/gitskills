import React,{Component}from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, SectionList,ListView,Platform,Navigator} from 'react-native'
import {commonStyle} from './commonStyle';
import SwipeView from 'react-native-swipeout'
const SERVER_URL ='http://localhost:8081/server/';
const ShoppingCart_API='shoppingCart.json';
const RightButtons =[
    {
        backgroundColor:'#7274eb',
        color:'white',
        text:'删除',
        onPress:()=>{this._delItems()}
    }];


// noinspection JSAnnotator
export default class ShoppingCart extends React.Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            status:[],
            isSelectedAllItem: false,
            totalNum: 0,
            totalPrice: 0.00
        }
    }
    _delItems(){

    }
    componentWillMount(){
        this.fetchData();
    }
    fetchData(){
        const req = new Request(SERVER_URL + ShoppingCart_API, {method: 'GET'});
        fetch(req).then((res) => {
            return res.json();
        }).then((result,done) => {
            if(!done)
            {
                let arr=[];
                for (let i = 0; i < result.length; i++) {
                    let items = result[i].shopItems;
                    let shopObj = {};
                    shopObj.checked = false;
                    shopObj.shopName=result[i].shopName;
                    shopObj.shopItems=result[i].shopItems;
                    let tempItems = [];
                    for (let j = 0; j < items.length; j++) {
                        let item = items[j];
                        item.checked = false;
                        item.quantity = item.minQuantity;
                        tempItems.push(item);
                    }
                    shopObj.items = tempItems;
                    arr.push(shopObj);

                }
                this.setState({status:arr});

            }
        }).catch((err) => {
            console.log(err);
        });
    }

    checkItem(sectionIndex, index) {
        let tempStatus = this.state.status;
        let tempShop = tempStatus[sectionIndex];
        let tempShopItems = tempStatus[sectionIndex].items;
        let item = tempShopItems[index];
        item.checked = !item.checked;

        let isSelectedAllShopItem = true;
        for (let j = 0; j < tempShopItems.length; j++) {
            let item = tempShopItems[j];
            if (!item.checked) {
                isSelectedAllShopItem = false;
                break
            }
        }

        tempShop.checked = isSelectedAllShopItem;

        let isSelectedAllShop = true;
        for (let k = 0; k < tempStatus.length; k ++) {
            let shop = tempStatus[k];
            if (!shop.checked) {
                isSelectedAllShop = false;
                break
            }
        }
        this.calculateCountAndPrice();
        this.setState({isSelectedAllItem: isSelectedAllShop, status: tempStatus})
    }

    checkedShop(index) {
        let tempStatus = this.state.status;
        let shop = tempStatus[index];
        shop.checked = !shop.checked;
        let items = shop.items;
        for (let j = 0; j < items.length; j++) {
            let item = items[j];
            item.checked = shop.checked;
        }

        let isSelectedAllShop = true;
        for (let j = 0; j < tempStatus.length; j++) {
            let shop = tempStatus[j];
            if (!shop.checked) {
                isSelectedAllShop = false;
                break
            }
        }

        this.calculateCountAndPrice();
        this.setState({isSelectedAllItem: isSelectedAllShop, status: tempStatus})
    }

    checkAllShop() {
        let tempSelectedAllItem = !this.state.isSelectedAllItem;
        let tempStatus = this.state.status;
        for (let i = 0; i < tempStatus.length; i++) {
            let shop = tempStatus[i];
            shop.checked = tempSelectedAllItem;
            let items = shop.items;
            for (let j = 0; j < items.length; j++) {
                let item = items[j];
                item.checked = tempSelectedAllItem
            }
        }

        this.calculateCountAndPrice();
        this.setState({isSelectedAllItem: tempSelectedAllItem, status: tempStatus})
    }

    minus(sectionIndex, index) {
        let tempStatus = this.state.status;
        let shop = tempStatus[sectionIndex];
        let items = shop.items;
        let item = items[index];
        if (item.quantity <= item.minQuantity) {
            alert('商品购买数量不能小于1')
        } else {
            item.quantity -= 1
        }

        if (item.checked) {
            this.calculateCountAndPrice();
        }
        this.setState({status: tempStatus});
    }

    add(sectionIndex, index) {
        let tempStatus = this.state.status;
        let shop = tempStatus[sectionIndex];
        let items = shop.items;
        let item = items[index];
        if (item.quantity >= item.maxQuantity) {
            alert('商品购买数量不能大于:'+item.maxQuantity);
        } else {
            item.quantity += 1;
        }
        if (item.checked) {
            this.calculateCountAndPrice();
        }
        this.setState({status: tempStatus});
    }

    calculateCountAndPrice() {
        let tempTotalNum = 0;
        let tempTotalPrice = 0;
        let tempStatus = this.state.status;
        for (let i = 0; i < tempStatus.length; i ++) {
            let shop = tempStatus[i];
            let items = shop.items;
            for (let j = 0; j < items.length; j++) {
                let item = items[j];
                if (item.checked) {
                    tempTotalNum += 1;
                    tempTotalPrice += item.itemPrice * item.quantity;
                }
            }
        }
        this.setState({totalNum: tempTotalNum, totalPrice: tempTotalPrice});
    }

    renderItem = info => {
        let item = info.item;
        let index = info.index;
        let sectionIndex = info.section.index;
        let shop = this.state.status[sectionIndex];
        let statusItem = shop.items[index];
        return (
         <SwipeView right={RightButtons}>
            <View style={styles.cellStyle}>
                <TouchableOpacity onPress={() => this.checkItem(sectionIndex, index)}>
                   <View style={styles.imageViewStyle}>
                    <Image style={styles.checkBox} source={{ uri:statusItem.checked ?'icon_shopping_selected_box':'icon_shopping_box'}} />
                   </View>
                </TouchableOpacity>
                <Image style={{width: 80, height: 80}} source={{uri: item.itemimg}}/>
                <View style={{justifyContent: commonStyle.around, flex: 1, marginHorizontal: 10, height: 50}}>
                    <Text style={{fontSize: 13, color: commonStyle.textBlockColor}}>{item.itemName}</Text>
                    <Text style={{fontSize: 13, color: commonStyle.textBlockColor}}>{`￥${item.itemPrice}`}</Text>
                </View>
                <View style={{flexDirection: commonStyle.row, alignItems: commonStyle.center, marginHorizontal: 10}}>
                    <TouchableOpacity onPress={() => this.minus(sectionIndex, index)}>
                        <Image source={{uri:'icon_shopping_minus'}} style={styles.checkBox}/>
                    </TouchableOpacity>
                    <Text style={{width: 30, textAlign: 'center'}}>{statusItem.quantity}</Text>
                    <TouchableOpacity onPress={() => this.add(sectionIndex, index)}>
                        <Image source={{uri:'icon_shopping_plus'}} style={styles.checkBox} />
                    </TouchableOpacity>
                </View>
            </View>
         </SwipeView>
        )
    };

    renderSectionHeader = info => {
        let section = info.section.key;
        let index = info.section.index;
        let shop = this.state.status[index];
        return (
            <View style={styles.sectionHeader}>
                <TouchableOpacity onPress={() => this.checkedShop(index)}>
                   <View style={styles.imageViewStyle}>
                     <Image style={styles.checkBox}  source={{uri:shop.checked ? 'icon_shopping_selected_box': 'icon_shopping_box'}}/>
                   </View>
                </TouchableOpacity>
                <Text style={{color: commonStyle.gray, fontSize: 12}}>{section}</Text>
            </View>
        )
    };
    renderSectionList(){

        var tempArr = this.state.status.map((item, index) => {
            let tempData = {};
            tempData.key = item.shopName;
            tempData.index = index;
            tempData.data = item.shopItems;
            console.log(item.shopItems);
            return tempData;
        });
        return(
            <SectionList keyExtractor={(item, index) => index}
                         renderSectionHeader={this.renderSectionHeader}
                         renderItem={this.renderItem}
                         sections={tempArr}
                         ItemSeparatorComponent={() => <View/>}
                         ListHeaderComponent={() => <View/>}
                         ListFooterComponent={() => <View/>}
            />
        );
    }
    _returnToMine(){
        this.props.navigation.goBack();
    }
    render() {

            return (
                <View style={styles.container}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                       <TouchableOpacity activeOpacity={0.5} onPress={this._returnToMine.bind(this)}>
                         <Image source={{uri:'icon_return_arrow'}} style={{height: Platform.OS === 'ios' ? 64 : 56,width: Platform.OS === 'ios' ? 64 : 56}}/>
                       </TouchableOpacity>
                         <View style={styles.navBar}>
                            <Text style={{marginTop: 15, fontSize: 17}}>购物车</Text>
                         </View>
                    </View>
                    {this.renderSectionList()}
                    <View style={styles.toolBar}>
                        <View style={{flex: 1, flexDirection: commonStyle.row, alignItems: commonStyle.center}}>
                            <TouchableOpacity onPress={() => this.checkAllShop()}>
                                <View style={styles.imageViewStyle}>
                                    <Image style={styles.checkBox}
                                           source={{uri: this.state.isSelectedAllItem ? 'icon_shopping_selected_box' : 'icon_shopping_box'}}/>
                                </View>
                            </TouchableOpacity>
                            <Text>全选</Text>
                        </View>
                        <Text style={{marginHorizontal: 10}}>合计:
                            <Text
                                style={{color: commonStyle.red}}>￥{parseFloat(this.state.totalPrice).toFixed(2)}</Text>
                        </Text>
                        <View style={{
                            width: 120,
                            backgroundColor: commonStyle.red,
                            alignItems: commonStyle.center,
                            justifyContent: commonStyle.center,
                            height: commonStyle.cellHeight
                        }}>
                            <Text style={{color: commonStyle.white}}>确认下单({this.state.totalNum})</Text>
                        </View>
                    </View>
                </View>
            )
        }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: commonStyle.white
    },
    navBar: {
        height: commonStyle.navHeight,
        alignItems: commonStyle.center,
        justifyContent: commonStyle.center,
        borderBottomWidth: commonStyle.lineWidth,
        borderBottomColor: commonStyle.lineColor
    },
    cellStyle: {
        flexDirection: commonStyle.row,
        alignItems: commonStyle.center,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: commonStyle.lineColor
    },
    sectionHeader: {
        height: 40,
        flexDirection: commonStyle.row,
        backgroundColor: commonStyle.bgColor,
        alignItems: commonStyle.center,
    },
    checkBox: {
        width: 20,
        height: 20,
    },
    imageViewStyle:{
        padding:7,
        justifyContent:commonStyle.center,
    },
    toolBar: {
        height: commonStyle.cellHeight,
        flexDirection: commonStyle.row,
        alignItems: commonStyle.center
    }
})