import React from 'react';
import {connect} from 'react-redux';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {RNCamera} from 'react-native-camera';
// import CameraRoll from '@react-native-community/cameraroll';
import RNFetchBlob from 'rn-fetch-blob';
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
});

class Recording extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  componentWillUnmount() {
    // this.cameraVM.stopRecording();
  }

  cameraVM = null;

  async takePicture(camera) {
    this.cameraVM = await camera;
    setTimeout(() => {
      this.startRecording(camera);
    }, 200);
  }

  async startRecording(camera) {
    const promise = await camera.recordAsync();
    if (promise) {
      const data = await promise;
      const arr = data.uri.split('/');
      const name = arr[arr.length - 1].split('.')[0];
      const p = {
        name: name,
        type: 'video/mp4',
        filename: arr[arr.length - 1],
        data: RNFetchBlob.wrap(data.uri.split('//')[1].slice(1)),
        _local: data.uri,
        fk_works_id: this.props.currentData.fk_works_id,
      };
      this.props.saveVideo(p);

      // RNFetchBlob.fetch(
      //   'POST',
      //   'https://yist.bfwit.net/upload',
      //   {
      //     Authorization: 'Bearer access-token',
      //     otherHeader: 'foo',
      //     'Content-Type': 'multipart/form-data',
      //   },
      //   [p],
      // )
      //   .then(response => {
      //     console.log(response.text());
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });

      // CameraRoll.save(data.uri).then(res => {
      //   RNFS.readDir(RNFS.DocumentDirectoryPath)
      //     .then(result => {
      //       return Promise.all([RNFS.stat(result[3].path), result[3].path]);
      //     })
      //     .then(statResult => {
      //       alert(JSON.stringify(statResult[0].isFile()));
      //     });
      // });
      // await RNFS.readFile(data.uri.split('//')[1], 'utf8').then(data => {
      //   alert(1);
      // });
      //   .then(result => {
      //     return Promise.all([RNFS.stat(result[3].path), result[3].path]);
      //   })
      //   .then(statResult => {
      //     alert(JSON.stringify(statResult[0]));
      //   });
    }
  }

  stopRecording() {
    this.cameraVM.stopRecording();
    this.props.closeRecording();
  }

  test = ({camera, status, recordAudioPermissionStatus}) => {
    // console.log('status:', status);
    if (status !== 'READY') {
      return <PendingView />;
    } else {
      // alert('ok');
    }
    this.takePicture(camera);
    return (
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={this.stopRecording.bind(this)}
          style={styles.capture}>
          <Text style={{fontSize: 14}}>结束</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.page}>
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
          {this.test()}
        </RNCamera>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    // videoInfo: state.videoInfo,
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
