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
    marginBottom: padding,
    fontSize: 15,
  },
  detailContent: {
    fontSize: 12,
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
    };
  }

  componentDidMount() {
    console.log('props: ', this.props);
  }

  startRecording() {
    this.setState({isShowRecording: true});
  }

  closeRecording() {
    this.setState({isShowRecording: false});
  }

  showVideo() {}
  // 上传视频
  uploadVideo() {
    console.log('打印存储值：');
    console.log(this.props.videoInfo);
    this.setState({uploadLoading: true});
    RNFetchBlob.fetch(
      'POST',
      'https://yist.bfwit.net/upload',
      {
        Authorization: 'Bearer access-token',
        otherHeader: 'foo',
        'Content-Type': 'multipart/form-data',
      },
      [this.props.videoInfo],
    )
      .then(response => {
        this.setState({uploadLoading: false});
        console.log('====================response================');
        const responseData = response.json();
        if (responseData.code == 0) {
          this.props.saveVideo(responseData);
          Alert.alert('上传完成');
        }
        console.log('====================================');
      })
      .catch(err => {
        console.log('==================err==================');
        console.log(err);
        console.log('====================================');
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
    this.setState({isShowRecording: true});
  }
  // 视频列表
  videoList() {
    Alert.alert('该功能开发中...');
    console.log('videoList::', this.props.videoList);
  }
  // 显示文案
  showText() {
    alert('该功能开发中...');
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
          <Text style={styles.detailTitle}>{params.name}</Text>
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
