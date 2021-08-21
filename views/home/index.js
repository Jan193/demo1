import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Recording from './recording';

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
  constructor() {
    super();
    this.state = {
      isShowRecording: false,
    };
  }

  closeRecording() {
    console.log('closeRecording...');
    this.setState({isShowRecording: false});
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
            onPress={this.startRecording.bind(this)}>
            <Text style={styles.buttonText}>上传视频</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this.startRecording.bind(this)}>
            <Text style={styles.buttonText}>显示文案</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this.startRecording.bind(this)}>
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

export default Home;
