import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from 'react-native';
import Recording from './recording';
// import CameraRoll from '@react-native-community/cameraroll';
import RNFetchBlob from 'rn-fetch-blob';
import {connect} from 'react-redux';
import UploadLoading from '../../components/uploadLoading';
import http from '../../http';
import VideoList from './videoList';

const padding = 10;

const styles = StyleSheet.create({
  index: {
    minHeight: '100%',
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
    };
  }

  componentDidMount() {}

  startRecording() {
    this.setState({isShowRecording: true});
  }

  closeRecording() {
    this.setState({isShowRecording: false});
  }

  showVideo() {
    // console.log(this.props.videoInfo);
    const videoInfo = this.props.videoInfo || {};
    this.props.navigation.navigate('VideoPlayer', {
      // video: 'http://yist.bfwit.net/upfile/20210824/img2060.mp4',
      video: videoInfo._local,
    });
  }
  // 上传视频
  uploadVideo() {
    const param = JSON.parse(JSON.stringify(this.props.videoInfo));
    if (!param || JSON.stringify(param) === '{}') {
      return Alert.alert('缺少参数', param);
    }
    delete param._local;
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
        this.setState({uploadLoading: false});
        const responseData = response.json();
        if (responseData.code === 0) {
          this.props.saveVideo(responseData);
          Alert.alert('提示', '上传完成');
        }
      })
      .catch(err => {
        Alert.alert('提示', err);
        this.setState({uploadLoading: false});
      });

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
          console.log('点击了确定');
        },
      },
    ]);
  }
  isShowVideoList = (value = false) => {
    this.setState({showVideoList: value});
  };
  // 视频列表
  videoList() {
    this.isShowVideoList(true);
    return;
    // console.log('videoList::', this.props.videoList);
    const {fk_works_id} = this.props.route.params;
    http
      .getRecTaskVideoList({fk_works_id})
      .then(res => {
        // this.setState({loading: false});
        if (res.data.code === 0) {
          console.log('result::', res.data.data);
        } else {
          Alert.alert('提示', res.data.msg);
        }
      })
      .catch(err => {
        Alert.alert('错误提示', err);
        // this.setState({loading: false});
      });
  }
  // 显示文案
  showText() {
    Alert.alert('提示', '该功能开发中...', [{text: '确定'}]);
  }

  prevData() {}

  nextData() {}

  render() {
    const {params} = this.props.route;
    const {modalVisible} = this.state;
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
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailTitle}>
            {params._index}. {params.title}
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
          <Recording closeRecording={this.closeRecording.bind(this)} />
        )}
        {this.state.showVideoList && (
          <VideoList isShowVideoList={this.isShowVideoList} params={params} />
        )}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    videoList: state.videoList,
    videoInfo: state.videoInfo,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    saveVideo: data => dispatch({type: 'saveVideo', data}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
