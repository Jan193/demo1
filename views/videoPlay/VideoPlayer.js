import React from 'react';
import Video from 'react-native-video';
import {
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
export default class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rate: 1,
      volume: 1,
      muted: false,
      resizeMode: 'contain',
      duration: 0.0,
      currentTime: 0.0,
      paused: true,
      loading: false,
    };
  }

  componentDidMount() {}
  video = null;

  onLoad = () => {
    this.setState({loading: false});
    this.video.seek(0);
  };
  onProgress = () => {
    // console.log('onProgress');
  };
  onEnd = () => {
    // console.log('onEnd');
  };
  onAudioBecomingNoisy = () => {
    // console.log('onAudioBecomingNoisy');
  };
  onAudioFocusChanged = () => {
    // console.log('onAudioFocusChanged');
  };

  closeVideo = () => {
    this.props.navigation.goBack();
  };

  onReadyForDisplay = () => {};

  render() {
    // const {videoURI} = this.props.route.params;
    const videoURI = this.props.route.params.video;
    return (
      <View style={styles.page}>
        <StatusBar
          hidden={false}
          backgroundColor="#000"
          barStyle="light-content"
        />
        <Video
          ref={ref => {
            //方法对引用Video元素的ref引用进行操作
            this.video = ref;
          }}
          // source={{uri: 'http://yist.bfwit.net/upfile/20210824/img2060.mp4', type: 'mpd'}} //设置视频源
          source={{uri: videoURI}} //设置视频源
          style={styles.fullScreen} //组件样式
          rate={this.state.rate} //播放速率
          paused={this.state.paused} //暂停
          volume={this.state.volume} //调节音量
          muted={this.state.muted} //控制音频是否静音
          resizeMode={this.state.resizeMode} //缩放模式
          onLoad={this.onLoad} //加载媒体并准备播放时调用的回调函数。
          onProgress={this.onProgress} //视频播放过程中每个间隔进度单位调用的回调函数
          onEnd={this.onEnd} //视频播放结束时的回调函数
          onAudioBecomingNoisy={this.onAudioBecomingNoisy} //音频变得嘈杂时的回调 - 应暂停视频
          onAudioFocusChanged={this.onAudioFocusChanged} //音频焦点丢失时的回调 - 如果焦点丢失则暂停
          repeat={false} //确定在到达结尾时是否重复播放视频。
          controls={true}
          onReadyForDisplay={this.onReadyForDisplay}
        />
        <TouchableOpacity style={styles.closeButton} onPress={this.closeVideo}>
          <Text style={styles.closeText}>&#215;</Text>
        </TouchableOpacity>

        {this.state.loading && (
          <View style={styles.videoLoading}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>努力加载中...</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  page: {
    width: '100%',
    height: '100%',
    // display: 'flex',
  },
  fullScreen: {
    // position: 'relative',
    // top: '50%',
    // left: '50%',
    // right: 0,
    // bottom: 0,
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 10,
    backgroundColor: 'transparent',
    padding: 10,
  },
  closeText: {
    color: '#fff',
    fontSize: 25,
  },
  videoLoading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  loadingText: {
    marginTop: 10,
    color: 'white',
  },
});
