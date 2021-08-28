import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  ToastAndroid,
  DrawerLayoutAndroid,
  Button,
} from 'react-native';
import Recording from './recording';
// import CameraRoll from '@react-native-community/cameraroll';
import RNFetchBlob from 'rn-fetch-blob';
import {connect} from 'react-redux';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import UploadLoading from '../../components/uploadLoading';
import http from '../../http';
// import http from '../../http';
// import VideoList from './videoList';

const padding = 10;

const styles = StyleSheet.create({
  index: {
    minHeight: '100%',
    display: 'flex',
  },
  buttonBox: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 1,
  },
  button: {
    width: '25%',
    height: 100,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    marginTop: 'auto',
    textAlign: 'center',
    position: 'relative',
    bottom: 10,
  },

  detail: {
    marginTop: 2,
    backgroundColor: '#fff',
    padding,
  },
  detailFlip: {
    marginTop: 2,
    backgroundColor: '#fff',
    padding,
    transform: [{scaleX: -1}],
  },
  detailTitle: {
    fontSize: 16,
  },
  detailContent: {
    fontSize: 14,
  },

  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomButton: {
    borderRadius: 4,
    backgroundColor: '#1CB84B',
  },
  bottomButtonText: {
    width: 55,
    height: 30,
    lineHeight: 30,
    textAlign: 'center',
    color: '#fff',
  },

  icon: {
    width: 30,
    height: 30,
    marginTop: 'auto',
    // marginBottom: 'auto',
  },

  showCameraSelect: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    width: '100%',
    height: '100%',
  },
  showCameraSelectContainer: {
    width: 200,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cameraSelectText: {
    textAlign: 'center',
    lineHeight: 50,
    color: '#1989fa',
  },
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowRecording: false,
      uploadLoading: false,
      modalVisible: false,
      playVideo: false,
      showVideoList: false,
      isFlip: false,
      currentData: {},
      showCameraSelect: false,
    };
  }

  componentDidMount() {
    const {params} = this.props.route;
    const data = params._list[params._index];
    data._index = params._index;
    this.setState({currentData: data});
  }

  startRecording() {
    // this.setState({isShowRecording: true});
    // this.props.navigation.navigate('Recording', this.state.currentData);
    /* launchCamera(
      {
        mediaType: 'video',
        videoQuality: 'high',
        cameraType: 'back',
        selectionLimit: 0,
      },
      response => {
        console.log('结果:', response);
      },
    ); */

    this.setState({showCameraSelect: true});
  }
  album = () => {
    this.setState({showCameraSelect: false});
    launchImageLibrary(
      {
        mediaType: 'video',
        videoQuality: 'high',
        cameraType: 'back',
        selectionLimit: 0,
      },
      response => {
        console.log('response:', response);
        const list = response.assets;
        list.forEach(item => {
          const p = {
            // name: name,
            type: 'video/mp4',
            filename: item.fileName,
            data: RNFetchBlob.wrap(item.uri.split('//')[1]),
            _local: item.uri,
            fk_works_id: this.state.currentData.fk_works_id,
          };
          this.props.saveVideo(p);
        });

        // this.props.navigation.navigate('VideoPlayer', {
        //   video: response.assets[0].uri,
        // });
      },
    );
  };
  shot = () => {
    this.setState({showCameraSelect: false});
    this.props.navigation.navigate('Recording', this.state.currentData);
    // launchCamera(
    //   {
    //     mediaType: 'video',
    //     videoQuality: 'high',
    //     cameraType: 'back',
    //     selectionLimit: 0,
    //   },
    //   response => {
    //     console.log('结果:', response);
    //   },
    // );
  };

  closeRecording() {
    this.setState({isShowRecording: false});
  }

  showVideo() {
    const {video_url} = this.state.currentData;
    if (video_url) {
      this.props.navigation.navigate('VideoPlayer', {
        // video: 'http://yist.bfwit.net/upfile/20210824/img2060.mp4',
        video: video_url,
      });
    } else {
      ToastAndroid.show('没有视频', ToastAndroid.TOP);
    }
  }

  addRecTaskVideo = file_url => {
    http
      .addRecTaskVideo({
        fk_works_id: this.state.currentData.fk_works_id,
        file_url,
      })
      .then(res => {
        if (res.data.code !== 0) {
          ToastAndroid.show(
            '提交视频地址出错:' + res.data.msg,
            ToastAndroid.TOP,
          );
        }
      })
      .catch(error => {
        ToastAndroid.show(error.message, ToastAndroid.TOP);
      });
  };
  videoUpload = (list, i) => {
    return new Promise((resolve, reject) => {
      const {data, filename, name, type} = list[i];
      const param = {data, filename, name, type};
      this.setState({uploadLoading: true});
      RNFetchBlob.fetch(
        'POST',
        'https://yist.bfwit.net/upload',
        {
          Authorization: 'Bearer access-token',
          otherHeader: 'foo',
          'Content-Type': 'multipart/form-data',
        },
        [param],
      )
        .then(response => {
          console.log('上传成功:', response.data);
          this.setState({uploadLoading: false});
          const responseData = response.json();
          if (responseData.code === 0) {
            this.addRecTaskVideo(responseData.url);
            resolve(responseData.data);
          }
        })
        .catch(error => {
          this.setState({uploadLoading: false});
          ToastAndroid.show('上传出错:' + error.message, ToastAndroid.TOP);
          reject(error);
        });
    });
  };

  forVideos = async list => {
    let i = 0;
    this.videoUpload(list, i).then(() => {
      i++;
      if (i === list.length) {
        ToastAndroid.show('上传完成', ToastAndroid.TOP);
        // this.setState({uploadLoading: false});
        this.props.clearVideo(this.state.currentData);
        return;
      }
      this.videoUpload(list, i);
    });
  };
  updateRecTaskStatus = () => {
    http
      .updateRecTaskStatus({
        id: this.state.currentData.fk_works_id,
        content_status: 2,
      })
      .then(res => {
        if (res.data.code !== 0) {
          ToastAndroid.show(
            '录制状态更改失败:' + res.data.msg,
            ToastAndroid.TOP,
          );
        }
      })
      .catch(error => {
        ToastAndroid.show(
          '录制状态更改报错:' + error.message,
          ToastAndroid.TOP,
        );
      });
  };
  // 上传视频
  uploadVideo() {
    const localVideos =
      this.props.videoList[this.state.currentData.fk_works_id] || [];
    if (localVideos.length <= 0) {
      return ToastAndroid.show('没有视频', ToastAndroid.TOP);
    }
    Alert.alert('提示', '请确认是否开始上传', [
      {text: '否', onPress: () => {}, type: 'cancel'},
      {
        text: '是',
        onPress: () => {
          this.forVideos(localVideos);
        },
      },
    ]);

    // RNFS.readDir(RNFS.CachesDirectoryPath)
    //   .then(result => {
    //     console.log('result:', result);
    //     // alert(JSON.stringify(result[3]));
    //     return Promise.all([RNFS.stat(result[3].path), result[3].path]);
    //   })
    //   .then(statResult => {
    //     alert(JSON.stringify(statResult[0]));
    //   });
    // alert(RNFS.ExternalStorageDirectoryPath);

    // CameraRoll.getPhotos({
    //   first: 1,
    //   assetType: 'Videos',
    // }).then(res => {
    // });
  }
  setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };
  // 重新拍摄
  resetRecording() {
    Alert.alert('提示', '是否确定要清空视频列表？', [
      {
        text: '否',
        type: 'cancel',
        onPress: () => {},
      },
      {
        text: '是',
        onPress: () => {
          this.props.clearVideo(this.state.currentData);
          ToastAndroid.show('清空成功', ToastAndroid.TOP);
        },
      },
    ]);
  }
  isShowVideoList = (value = false) => {
    this.setState({showVideoList: value});
  };
  // 视频列表
  videoList() {
    this.props.navigation.navigate('VideoList', this.state.currentData);
  }
  // 显示文案
  showText() {
    ToastAndroid.show('该功能开发中...', ToastAndroid.TOP);
  }

  prevData() {
    const params = this.props.route.params;
    const currentIndex = this.state.currentData._index;
    if (currentIndex === 0) {
      return ToastAndroid.show('没有上一个了', ToastAndroid.TOP);
    }
    const prev = params._list[currentIndex - 1];
    prev._index = currentIndex - 1;
    this.setState({currentData: prev});
  }

  nextData() {
    const params = this.props.route.params;
    const currentIndex = this.state.currentData._index;
    const next = params._list[currentIndex + 1];
    if (next) {
      next._index = currentIndex + 1;
      this.setState({currentData: next});
    } else {
      ToastAndroid.show('没有下一个了', ToastAndroid.TOP);
    }
  }

  teleprompter() {
    this.setState({isFlip: !this.state.isFlip});
  }

  render() {
    // const {params} = this.props.route;
    const params = this.state.currentData;
    const {modalVisible, isFlip} = this.state;
    return (
      <View style={styles.index}>
        {this.state.uploadLoading && <UploadLoading text="上传中..." />}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            this.setModalVisible(!modalVisible);
          }}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showCameraSelect}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            // this.setModalVisible(!this.state.showCameraSelect);
          }}>
          <View style={styles.showCameraSelect}>
            <View style={styles.showCameraSelectContainer}>
              <TouchableOpacity onPress={() => this.album()}>
                <Text style={styles.cameraSelectText}>从相册选择</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.shot()}>
                <Text style={styles.cameraSelectText}>拍摄</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={styles.buttonBox}>
          <TouchableOpacity
            style={styles.button}
            onPress={this.startRecording.bind(this)}>
            <Image
              source={require('../../resource/images/recording.png')}
              style={styles.icon}
            />
            <Text style={styles.buttonText}>开始拍摄</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this.resetRecording.bind(this)}>
            <Image
              source={require('../../resource/images/reload.png')}
              style={styles.icon}
            />
            <Text style={styles.buttonText}>重新拍摄</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this.videoList.bind(this)}>
            <Image
              source={require('../../resource/images/list.png')}
              style={styles.icon}
            />
            <Text style={styles.buttonText}>视频列表</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this.uploadVideo.bind(this)}>
            <Image
              source={require('../../resource/images/upload.png')}
              style={styles.icon}
            />
            <Text style={styles.buttonText}>上传视频</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this.showText.bind(this)}>
            <Image
              source={require('../../resource/images/text.png')}
              style={styles.icon}
            />
            <Text style={styles.buttonText}>显示文案</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this.showVideo.bind(this)}>
            <Image
              source={require('../../resource/images/video.png')}
              style={styles.icon}
            />
            <Text style={styles.buttonText}>演示视频</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this.teleprompter.bind(this)}>
            <Image
              source={require('../../resource/images/word.png')}
              style={styles.icon}
            />
            <Text style={styles.buttonText}>提词器</Text>
          </TouchableOpacity>
        </View>
        <View style={isFlip ? styles.detailFlip : styles.detail}>
          <Text style={styles.detailTitle}>
            {params._index + 1}. {params.title}
          </Text>
          <Text style={styles.detailContent}>{params.content}</Text>
        </View>
        <View style={styles.bottom}>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={this.prevData.bind(this)}>
            <Text style={styles.bottomButtonText}>上一个</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={this.nextData.bind(this)}>
            <Text style={styles.bottomButtonText}>下一个</Text>
          </TouchableOpacity>
        </View>
        {this.state.isShowRecording && (
          <Recording
            closeRecording={this.closeRecording.bind(this)}
            currentData={params}
          />
        )}
        {/* {this.state.showVideoList && (
          <VideoList isShowVideoList={this.isShowVideoList} params={params} />
        )} */}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    videoList: state.videoList,
    // videoInfo: state.videoInfo,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    saveVideo: data => dispatch({type: 'saveVideo', data}),
    clearVideo: data => dispatch({type: 'clearVideo', data}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
