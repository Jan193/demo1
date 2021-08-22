import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Recording from './recording';
import CameraRoll from '@react-native-community/cameraroll';
import RNFetchBlob from 'rn-fetch-blob';
import {connect} from 'react-redux';

const styles = StyleSheet.create({
  index: {
    minHeight: '100%',
  },
  buttonBox: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    width: '25%',
    height: 100,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    marginTop: 'auto',
    textAlign: 'center',
  },
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowRecording: false,
    };
  }

  closeRecording() {
    this.setState({isShowRecording: false});
  }

  showVideo() {
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

    CameraRoll.getPhotos({
      first: 1,
      assetType: 'Videos',
    }).then(res => {
      const node = res.edges[0].node;
      const arr = node.image.uri.split('/');
      const name = arr[arr.length - 1].split('.')[0];
      RNFetchBlob.fetch(
        'POST',
        'https://yist.bfwit.net/upload',
        {
          Authorization: 'Bearer access-token',
          otherHeader: 'foo',
          'Content-Type': 'multipart/form-data',
        },
        [
          {
            name: name,
            type: node.type,
            filename: arr[arr.length - 1],
            data: RNFetchBlob.wrap(node.image.uri.split('//')[1].slice(1)),
          },
        ],
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
    });
  }

  uploadVideo() {
    console.log('打印存储值：');
    console.log(this.props.videoInfo);
  }

  render() {
    return (
      <View style={styles.index}>
        <View style={styles.buttonBox}>
          <TouchableOpacity
            style={styles.button}
            onPress={this.startRecording.bind(this)}>
            <Text style={styles.buttonText}>开始拍摄</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this.startRecording.bind(this)}>
            <Text style={styles.buttonText}>重新拍摄</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this.startRecording.bind(this)}>
            <Text style={styles.buttonText}>视频列表</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this.uploadVideo.bind(this)}>
            <Text style={styles.buttonText}>上传视频</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this.startRecording.bind(this)}>
            <Text style={styles.buttonText}>显示文案</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this.showVideo.bind(this)}>
            <Text style={styles.buttonText}>演示视频</Text>
          </TouchableOpacity>
        </View>
        {this.state.isShowRecording && (
          <Recording closeRecording={this.closeRecording.bind(this)} />
        )}
      </View>
    );
  }

  startRecording() {
    this.setState({isShowRecording: true});
  }
}

const mapStateToProps = state => {
  return {
    videoInfo: state.videoInfo,
  };
};

export default connect(mapStateToProps)(Home);
