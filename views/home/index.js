import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
// import {Navigation} from 'react-native-navigation';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  box: {
    borderWidth: 1,
    borderColor: '#ddd',
    width: '25%',
    height: 100,
    lineHeight: 100,
    backgroundColor: '#eee',
  },
  text: {
    textAlign: 'center',
  },
});

const App = props => {
  function startRecording() {
    console.log('Start recording');
    // Navigation.push(props.componentId, {
    //   component: {
    //     name: 'recording',
    //     options: {},
    //   },
    // });
  }

  const uploadVideo = () => {
    console.log('Uploading video');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.box} onPress={startRecording}>
        <Text style={styles.text}>开始拍摄</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.box} onPress={uploadVideo}>
        <Text style={styles.text}>上传视频</Text>
      </TouchableOpacity>
    </View>
  );
};
// Navigation.registerComponent('home', () => App);
export default App;
