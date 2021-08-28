import React from 'react';
import Video from 'react-native-video';
import {StyleSheet, ToastAndroid, View} from 'react-native';

const styles = StyleSheet.create({
  page: {
    width: '100%',
    height: '100%',
    display: 'flex',
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
});

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
    };
  }

  componentDidMount() {}
  video = null;

  onLoad = () => {
    // console.log('onLoad');
    this.video.seek(-1);
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

  render() {
    // const {videoURI} = this.props.route.params;
    const videoURI = this.props.route.params.video;
    return (
      <View style={styles.page}>
        <Video
          ref={ref => {
            //方法对引用Video元素的ref引用进行操作
            this.video = ref;
          }}
          // source={{uri: 'http://yist.bfwit.net/upfile/20210824/img2060.mp4', type: 'mpd'}} //设置视频源
          source={{uri: videoURI, type: 'mpd'}} //设置视频源
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
        />
      </View>
    );
  }
}
