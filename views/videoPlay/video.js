import React, {Component} from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  BackHandler,
} from 'react-native';

import Video from 'react-native-video';

function formatTime(second) {
  let h = 0,
    i = 0,
    s = parseInt(second);
  if (s > 60) {
    i = parseInt(s / 60);
    s = parseInt(s % 60);
  }
  // 补零
  let zero = function (v) {
    return v >> 0 < 10 ? '0' + v : v;
  };
  console.log([zero(h), zero(i), zero(s)].join(':'));
  // return [zero(h), zero(i), zero(s)].join(":");
  return zero(s);
}

export default class VideoScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    rate: 1,
    volume: 1,
    muted: false,
    resizeMode: 'contain',
    duration: '00:00',
    currentTime: '00:00',
    paused: true,
    totalSeconds: 0,
    currentSeconds: 0,
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
  }

  onBackAndroid = () => {
    this.props.navigation.goBack();
    return true;
  };

  onLoad = data => {
    const totalSeconds = Math.ceil(data.duration);
    this.setState({
      duration: this.getTime(totalSeconds),
      totalSeconds: totalSeconds,
    });
    this.video.seek(-1);
  };

  getTime = totalSeconds => {
    let minute = 0;
    let seconds = 0;
    if (totalSeconds > 60) {
      minute = parseInt(totalSeconds / 60, 10);
      seconds = totalSeconds - minute * 60;
    } else {
      seconds = totalSeconds;
    }
    minute = minute > 10 ? minute : '0' + minute;
    seconds = seconds > 10 ? seconds : '0' + seconds;
    return minute + ':' + seconds;
  };

  onProgress = data => {
    const totalSeconds = Math.ceil(data.currentTime);
    this.setState({
      currentTime: this.getTime(totalSeconds),
      currentSeconds: totalSeconds,
    });
  };

  onEnd = () => {
    this.setState({
      paused: true,
      currentTime: '00:00',
      currentSeconds: 0,
    });
    this.video.seek(0);
  };

  onAudioBecomingNoisy = () => {
    this.setState({paused: true});
  };

  onAudioFocusChanged = event => {
    this.setState({paused: !event.hasAudioFocus});
  };

  getCurrentTimePercentage() {
    if (this.state.currentSeconds > 0) {
      return this.state.currentSeconds / this.state.totalSeconds;
    }
    return 0;
  }

  clickScreen = () => {
    // this.setState({currentSeconds: 0}, () => {
    //   this.setState({paused: !this.state.paused});
    // });
    this.setState({paused: !this.state.paused});
  };

  renderRateControl(rate) {
    const isSelected = this.state.rate === rate;

    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({rate});
        }}>
        <Text
          style={[
            styles.controlOption,
            {fontWeight: isSelected ? 'bold' : 'normal'},
          ]}>
          {rate}x
        </Text>
      </TouchableOpacity>
    );
  }

  renderResizeModeControl(resizeMode) {
    const isSelected = this.state.resizeMode === resizeMode;

    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({resizeMode});
        }}>
        <Text
          style={[
            styles.controlOption,
            {fontWeight: isSelected ? 'bold' : 'normal'},
          ]}>
          {resizeMode}
        </Text>
      </TouchableOpacity>
    );
  }

  renderVolumeControl(volume) {
    const isSelected = this.state.volume === volume;

    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({volume});
        }}>
        <Text
          style={[
            styles.controlOption,
            {fontWeight: isSelected ? 'bold' : 'normal'},
          ]}>
          {volume * 100}%
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    const flexCompleted = this.getCurrentTimePercentage() * 100;
    const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.fullScreen} onPress={this.clickScreen}>
          <Video
            ref={ref => {
              this.video = ref;
            }}
            /* For ExoPlayer */
            source={{
              uri: 'https://vd2.bdstatic.com/mda-mhq3h7s5jh4jtv82/1080p/cae_h264/1629859214331635911/mda-mhq3h7s5jh4jtv82.mp4?v_from_s=hkapp-haokan-hnb&auth_key=1629943594-0-0-ae7704188de89f03788ed6c55c0036de&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest=3000185_1',
              type: 'mpd',
            }}
            style={styles.fullScreen}
            rate={this.state.rate}
            paused={this.state.paused}
            volume={this.state.volume}
            muted={this.state.muted}
            resizeMode={this.state.resizeMode}
            onLoad={this.onLoad}
            onProgress={this.onProgress}
            onEnd={this.onEnd}
            onAudioBecomingNoisy={this.onAudioBecomingNoisy}
            onAudioFocusChanged={this.onAudioFocusChanged}
            repeat={false}
          />
        </TouchableOpacity>
        {/* <View style={styles.textStyle}>
          <Text style={styles.volumeControl}>
            {formatTime(this.state.duration - this.state.currentTime)}
          </Text>

          <Button
            style={styles.btnStyle}
            title={'关闭广告'}
            color={'#73808080'}
            onPress={() => {
              this.props.navigation.goBack();
            }}
          />
        </View> */}
        {/* 进度条 */}
        <View style={styles.controls}>
          {/* <View style={styles.generalControls} /> */}
          <TouchableOpacity>
            <Text style={styles.videoButton}>
              {this.state.currentSeconds > 0 ? '暂停' : '播放'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.time}>{this.state.currentTime}</Text>
          <View style={styles.trackingControls}>
            <View style={styles.progress}>
              <View
                style={[styles.innerProgressCompleted, {flex: flexCompleted}]}
              />
              <View
                style={[styles.innerProgressRemaining, {flex: flexRemaining}]}
              />
            </View>
          </View>
          <Text style={styles.time}>{this.state.duration}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  textStyle: {
    paddingLeft: 10,
    paddingTop: 25,
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  btnStyle: {
    paddingRight: 10,
    paddingTop: 25,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  controls: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoButton: {
    color: '#fff',
  },
  time: {
    marginLeft: 10,
    color: '#fff',
  },
  trackingControls: {
    flex: 1,
    height: 4,
    marginLeft: 10,
  },
  progress: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
  },
  innerProgressCompleted: {
    height: 4,
    backgroundColor: '#cccccc',
  },
  innerProgressRemaining: {
    height: 4,
    backgroundColor: '#2C2C2C',
  },
  generalControls: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
    paddingTop: 10,
  },
  rateControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  volumeControl: {
    fontSize: 25,
    color: '#fff',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resizeModeControl: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlOption: {
    alignSelf: 'center',
    fontSize: 11,
    color: 'white',
    paddingLeft: 2,
    paddingRight: 2,
    lineHeight: 12,
  },
});
