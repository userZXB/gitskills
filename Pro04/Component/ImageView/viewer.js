import React, {Component} from 'react';
import { Modal } from 'react-native';
//import ImageViewer from 'react-native-image-zoom-viewer';

export default class Viewer extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            images:[{url:'http://img02.tooopen.com/images/20160509/tooopen_sy_161967094653.jpg'},{url:'http://pic.qiantucdn.com/58pic/17/86/50/76c58PICbVx_1024.jpg!qt324'},{url:"http://pic.sc.chinaz.com/files/pic/pic9/201610/apic23847.jpg"}],
            index:0,
            modalVisible: true
        };
    }
  /*componentWillMount() {
        this.setState({
            images: this.props.images,
            index: this.props.indexNum
        });
    }
    componentDidMount(){
        console.log(this.props.indexNum);
        console.log(this.props.indexNum);
    }
*/
    render() {
        return (
            <Modal visible={this.state.modalVisible} transparent={true} onRequestClose={() => {
                this.setState({ modalVisible: false });
            }}>
                   <ImageViewer
                    imageUrls={this.state.images} /*照片路径*/
                    enableImageZoom={true} /*是否开启手势缩放*/
                    saveToLocalByLongPress={true}/*长按保存至本地*/
                    index={this.state.index} /*初始显示第几张*/
                    failImageSource={{uri:'icon_failed'}} /*加载失败图片*/
                    onClick={()=>{console.log("点击了图片")}}
                   />
            </Modal>
        );
    }
}