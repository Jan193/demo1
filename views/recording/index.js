import React from 'react';
import {connect} from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import RNFetchBlob from 'rn-fetch-blob';
import storage from '../../js/storage';

const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <Text>Waiting</Text>
  </View>
);
class Recording extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentData: {},
      cameraVM: null,
      isSave: false, // 点击保存时为true
    };
  }

  camera = null;
  isSave = false;

  componentDidMount() {
    this.setState({
      currentData: this.props.route.params,
    });
  }

  getMobile() {
    return new Promise(resolve => {
      storage.load({key: 'userInfo'}).then(res => {
        if (res && res.mobile) {
          if (res.mobile === '13140097001') {
            resolve(res.mobile);
          }
        }
      });
    });
  }

  async takePicture(camera) {
    if (camera) {
      try {
        this.camera = camera;
        // setTimeout(() => {
        //   this.startRecording();
        // }, 100);
        if (this.props.ws) {
          this.getMobile().then(() => {
            this.props.ws.send(
              JSON.stringify({
                token: this.props.token,
                cmd: 'chart',
                data: {
                  type: 1,
                },
              }),
            );
          });

          this.props.ws.onmessage = async e => {
            const data = JSON.parse(e.data);
            if (data.cmd === 'chart') {
              if (data.data.type === 1) {
                this.startRecording();
              } else if (data.data.type === 2) {
                this.isSave = true;
                await this.camera.stopRecording();
                await this.props.navigation.goBack();
              }
            }
          };
        }
      } catch (e) {
        console.error('相机捕获错误:', e);
        Alert.alert('提示', e.message);
        this.props.navigation.goBack();
      }
    }
  }

  async startRecording() {
    if (this.camera) {
      try {
        const promise = this.camera.recordAsync();
        if (promise) {
          const data = await promise;
          if (this.isSave) {
            const arr = data.uri.split('/');
            const name = arr[arr.length - 1].split('.')[0];
            const p = {
              name: name,
              type: 'video/mp4',
              filename: arr[arr.length - 1],
              data: RNFetchBlob.wrap(data.uri.split('//')[1].slice(1)),
              _local: data.uri,
              fk_works_id: this.state.currentData.fk_works_id,
            };
            this.props.saveVideo(p);
          }
        }
      } catch (e) {
        console.log('捕获错误2:', e);
        Alert.alert('提示', e.message);
        this.props.navigation.goBack();
      }
    }
    /* RNFetchBlob.fetch(
      'POST',
      'https://yist.bfwit.net/upload',
      {
        Authorization: 'Bearer access-token',
        otherHeader: 'foo',
        'Content-Type': 'multipart/form-data',
      },
      [p],
    )
      .then(response => {
        console.log('====================response================');
        console.log(response.text());
        console.log('====================================');
      })
      .catch(err => {
        console.log('==================err==================');
        console.log(err);
        console.log('====================================');
      });
    */

    // CameraRoll.save(data.uri).then(res => {
    //   console.log('====================================');
    //   console.log('ress:', res);
    //   console.log('====================================');
    //   RNFS.readDir(RNFS.DocumentDirectoryPath)
    //     .then(result => {
    //       console.log('result:', result);
    //       // alert(JSON.stringify(result[3]));
    //       return Promise.all([RNFS.stat(result[3].path), result[3].path]);
    //     })
    //     .then(statResult => {
    //       alert(JSON.stringify(statResult[0].isFile()));
    //     });
    // });
    // await RNFS.readFile(data.uri.split('//')[1], 'utf8').then(data => {
    //   console.log('data:', data);
    //   alert(1);
    // });
    //   .then(result => {
    //     console.log('result:', result);
    //     // alert(JSON.stringify(result[3]));
    //     return Promise.all([RNFS.stat(result[3].path), result[3].path]);
    //   })
    //   .then(statResult => {
    //     alert(JSON.stringify(statResult[0]));
    //   });
  }

  async stopRecording() {
    // this.isSave = true;
    // await this.camera.stopRecording();
    // await this.props.navigation.goBack();
    this.props.ws.send(
      JSON.stringify({
        token: this.props.token,
        cmd: 'chart',
        data: {
          type: 2,
        },
      }),
    );
  }

  renderContent = ({camera, status, recordAudioPermissionStatus}) => {
    if (status !== 'READY' || recordAudioPermissionStatus !== 'AUTHORIZED') {
      return <PendingView />;
    }

    if (status === 'READY' && recordAudioPermissionStatus === 'AUTHORIZED') {
      this.takePicture(camera);
    }
    return (
      <View style={styles.captureBottom}>
        <TouchableOpacity
          onPress={() => this.props.navigation.goBack.bind(this)()}
          style={styles.captureButton}>
          <Text style={styles.captureIcon}>&#10007;</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.stopRecording.bind(this)}
          style={styles.captureButton}>
          <Text style={styles.captureIcon}>&#10003;</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.page}>
        <StatusBar hidden={true} />
        <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}>
          {this.renderContent}
        </RNCamera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  page: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  captureButton: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  captureIcon: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  captureBottom: {
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

const mapStateToProps = state => {
  return {
    // videoInfo: state.videoInfo,
    ws: state.app.ws,
    token: state.app.token,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // saveVideoInfo: data => dispatch({type: 'saveVideoInfo', data}),
    saveVideo: data => dispatch({type: 'saveVideo', data}),
  };
};

// export default Recording;
export default connect(mapStateToProps, mapDispatchToProps)(Recording);
