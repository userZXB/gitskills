import SYImagePicker from 'react-native-syan-image-picker'
/*从相册中选择图片，函数调用有三种*/
export default {
    /*普通的回调函数形式*/
    handleOpenImagePicker (params){
        SYImagePicker.showImagePicker({imageCount: 9, isRecordSelected: true}, (err, photos) => {
            console.log(err, photos);
            if (!err) {
                this.setState({
                    params: [...params, ...photos]
                })
            }
        })
    },

/**
 * 使用方式sync/await
 * 相册参数暂时只支持默认参数中罗列的属性；
 * @returns {Promise<void>}
 */
    /*使用sync/await形式异步取回返回值,为什么需要清空所有缓存*/
    async handleAsyncSelectPhoto(params){
    SYImagePicker.removeAllPhoto();
    try {
        const photos = await SYImagePicker.asyncShowImagePicker({imageCount: 1, isCrop: true, showCropCircle: true});
        // 选择成功
        this.setState({
            params: [...params, ...photos]
        })
    } catch (err) {
        // 取消选择，err.message为"取消"
        console.log(err.message);
    }
    },
   /*使用Promise函数调用*/
    handlePromiseSelectPhoto (params) {
    SYImagePicker.asyncShowImagePicker({imageCount: 3, enableBase64: true, showCropCircle: true})
        .then(photos => {
            console.log(photos);
            const arr = photos.map(v => {
                return {...v, enableBase64: true}
            });
            // 选择成功
            this.setState({
                params: [...params, ...arr]
            })
        })
        .catch(err => {
            // 取消选择，err.message为"取消"
            console.log(err.message);
        })
   },
    /*从相机拍照选取只支持回调函数*/
     handleLaunchCamera (params){
      SYImagePicker.openCamera({isCrop: true, showCropCircle: true, showCropFrame: false}, (err, photos) => {
        console.log(err, photos);
        if (!err) {
            this.setState({
                params: [...params, ...photos]
            })
        }
    })
   },
    handleDeleteCache ()  {
         SYImagePicker.deleteCache()
      }
     }