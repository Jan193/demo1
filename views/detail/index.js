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
} from 'react-native';
import Recording from './recording';
// import CameraRoll from '@react-native-community/cameraroll';
import RNFetchBlob from 'rn-fetch-blob';
import {connect} from 'react-redux';

import UploadLoading from '../../components/uploadLoading';
import http from '../../http';
import DocumentPicker from 'react-native-document-picker';

const padding = 10;
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
      uplodProgress: '上传中...', // 上传进度
    };
  }

  componentDidMount() {
    const {params} = this.props.route;
    const data = params._list[params._index];
    data._index = params._index;
    this.setState({currentData: data});
  }

  startRecording() {
    this.setState({showCameraSelect: true});
  }
  // 相册中选择视频
  album = async () => {
    this.setState({showCameraSelect: false});
    try {
      const res = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.video],
      });
      if (res.length > 0) {
        res.forEach(item => {
          const video = {
            name: item.name.split('.')[0], // 不带后缀
            type: item.type,
            filename: item.name, // 带后缀
            data: RNFetchBlob.wrap(item.uri),
            _local: item.uri,
            fk_works_id: this.state.currentData.fk_works_id,
          };
          this.props.saveVideo(video);
        });
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };
  // 打开拍摄页面
  shot = () => {
    this.setState({showCameraSelect: false});
    this.props.navigation.navigate('Recording', this.state.currentData);
  };

  clickBackground = () => {
    this.setState({showCameraSelect: false});
  };

  closeRecording() {
    this.setState({isShowRecording: false});
  }

  showVideo() {
    const {video_url} = this.state.currentData;
    if (video_url) {
      this.props.navigation.navigate('VideoPlayer', {
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
      RNFetchBlob.config({
        // trusty: true,
        timeout: 6000,
      })
        .fetch(
          'POST',
          http.INTERFACE.upload,
          {
            Authorization: 'Bearer access-token',
            otherHeader: 'foo',
            'Content-Type': 'multipart/form-data',
          },
          [param],
        )
        .uploadProgress({interval: 200}, (received, total) => {
          const progress = Math.floor((received / total) * 100) + '%';
          const complete_total = i + 1 + '/' + list.length;
          const uplodProgress = progress + ' ' + complete_total;
          this.setState({uplodProgress: uplodProgress});
        })
        .then(response => {
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
        this.updateRecTaskStatus();
        ToastAndroid.show('上传完成', ToastAndroid.TOP);
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
    // ToastAndroid.show('该功能开发中...', ToastAndroid.TOP);
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

  closeCameraSelect = () => {
    this.setState({showCameraSelect: false});
  };

  render() {
    // const {params} = this.props.route;
    const params = this.state.currentData;
    const {modalVisible, isFlip, uplodProgress} = this.state;
    return (
      <View style={styles.index}>
        {this.state.uploadLoading && <UploadLoading text={uplodProgress} />}
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
            this.clickBackground();
          }}>
          <View style={styles.showCameraSelect}>
            <TouchableOpacity
              style={styles.cameraOpacity}
              onPress={() => this.closeCameraSelect()}
            />
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
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  cameraOpacity: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  showCameraSelectContainer: {
    width: '100%',
    // height: 100,
    backgroundColor: '#fff',
    borderRadius: 4,
    position: 'absolute',
    bottom: 0,
  },
  cameraSelectText: {
    textAlign: 'center',
    lineHeight: 60,
    fontSize: 17,
    color: '#1989fa',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
});

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
