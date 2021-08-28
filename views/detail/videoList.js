import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  Alert,
  ToastAndroid,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import Loading from '../../components/Loading';
import http from '../../http';

const statusBarHeight = parseInt(StatusBar.currentHeight, 10);

class VideoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      local: [],
      lineVideos: [],
      showLocal: true,
      showOnLine: true,
    };
  }

  componentDidMount() {
    console.log('本地视频::', this.props.videoList);
    this.setState({
      local: this.props.videoList[this.props.route.params.fk_works_id] || [],
    });
    this.getLineVideos();
  }

  getLineVideos() {
    const {fk_works_id} = this.props.route.params;
    http
      .getRecTaskVideoList({fk_works_id})
      .then(res => {
        this.setState({loading: false});
        if (res.data.code === 0) {
          this.setState({lineVideos: res.data.data});
        } else {
          Alert.alert('提示', res.data.msg);
        }
      })
      .catch(err => {
        Alert.alert('错误提示', err);
        this.setState({loading: false});
      });
  }

  // clickBlank = () => {
  //   this.props.isShowVideoList(false);
  // };

  deleteItem = (item, index) => {
    this.state.local.splice(index, 1);
    this.setState({local: this.state.local});
  };

  toggleShowLocal = () => {
    this.setState({showLocal: !this.state.showLocal});
  };

  toggleShowOnLine = () => {
    this.setState({showOnLine: !this.state.showOnLine});
  };

  playVideo = uri => {
    this.props.navigation.navigate('VideoPlayer', {
      // video: 'http://yist.bfwit.net/upfile/20210824/img2060.mp4',
      video: uri,
    });
  };

  getLocalStyle = () => {
    const {showLocal, showOnLine} = this.state;
    if (showLocal) {
      if (showOnLine) {
        return styles.content;
      } else {
        return styles.contentNone;
      }
    } else {
      return;
    }
  };

  getLineStyle = () => {
    const {showLocal, showOnLine} = this.state;
    if (showOnLine) {
      if (showLocal) {
        return styles.content;
      } else {
        return styles.contentNone;
      }
    } else {
      return;
    }
  };

  render() {
    const {params} = this.props.route;
    const {local, showLocal, lineVideos, showOnLine} = this.state;
    const isHasData = lineVideos.length > 0;

    const noneVideo = () => <Text style={styles.none}>暂无视频</Text>;

    const localList = () => {
      if (local.length > 0) {
        return (
          <FlatList
            data={local}
            keyExtractor={(item, index) => index}
            renderItem={({item, index}) => {
              return (
                <View style={styles.item}>
                  <TouchableOpacity
                    style={styles.videoIcon}
                    onPress={() => this.playVideo(item._local)}>
                    <Image
                      source={require('../../resource/images/play.png')}
                      style={styles.playIcon}
                    />
                  </TouchableOpacity>
                  <Text style={styles.itemText} numberOfLines={2}>
                    {item._local}
                  </Text>
                  <TouchableOpacity
                    style={styles.deleteIcon}
                    onPress={() => this.deleteItem(item, index)}>
                    <Text style={{fontSize: 16}}>&#xd7;</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        );
      } else {
        return noneVideo();
      }
    };

    const lineList = () => {
      if (isHasData) {
        return (
          <FlatList
            style={styles.list}
            data={lineVideos}
            keyExtractor={(item, index) => index}
            renderItem={({item, index}) => {
              return (
                <View style={styles.item}>
                  <TouchableOpacity
                    style={styles.videoIcon}
                    onPress={() => this.playVideo(item.file_url)}>
                    <Image
                      source={require('../../resource/images/play.png')}
                      style={styles.playIcon}
                    />
                  </TouchableOpacity>
                  <Text style={styles.itemText} numberOfLines={2}>
                    {item.file_url}
                  </Text>
                </View>
              );
            }}
          />
        );
      } else {
        return noneVideo();
      }
    };
    return (
      <View style={styles.page}>
        {this.state.loading && <Loading />}
        {/* <TouchableOpacity style={styles.blank} onPress={this.clickBlank} /> */}
        <View style={styles.main}>
          <Text style={styles.title}>{params.title}</Text>
          <View style={styles.container}>
            <View style={this.getLocalStyle()}>
              <TouchableOpacity
                style={styles.head}
                onPress={() => this.toggleShowLocal()}>
                <Text>本地视频</Text>
                {showLocal ? (
                  <Image
                    source={require('../../resource/images/arrow-top.png')}
                    style={styles.arrow}
                  />
                ) : (
                  <Image
                    source={require('../../resource/images/arrow-down.png')}
                    style={styles.arrow}
                  />
                )}
              </TouchableOpacity>
              {this.state.showLocal && localList()}
            </View>
            <View style={this.getLineStyle()}>
              <TouchableOpacity
                style={styles.head}
                onPress={() => this.toggleShowOnLine()}>
                <Text>已上传视频</Text>
                {showOnLine ? (
                  <Image
                    source={require('../../resource/images/arrow-top.png')}
                    style={styles.arrow}
                  />
                ) : (
                  <Image
                    source={require('../../resource/images/arrow-down.png')}
                    style={styles.arrow}
                  />
                )}
              </TouchableOpacity>
              {showOnLine && lineList()}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  page: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
    // zIndex: 200,
    backgroundColor: '#fff',
    // display: 'flex',
    paddingBottom: statusBarHeight,
    // height: '100%',
  },
  blank: {
    width: '100%',
    height: 150,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  main: {
    // flex: 1,
    height: '100%',
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
  },
  head: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    height: 30,
    borderBottomWidth: 1,
    borderColor: '#eee',
    // marginTop: 10,
  },
  arrow: {
    // display: 'inline-block',
    width: 12,
    height: 12,
    marginLeft: 'auto',
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10,
  },
  videoIcon: {
    width: 100,
    height: 50,
    backgroundColor: '#000',
  },
  playIcon: {
    width: 25,
    height: 25,
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  itemText: {
    flex: 1,
    overflow: 'hidden',
    marginLeft: 5,
    // textOverflow: 'ellipsis',
    // whiteSpace: 'nowrap',
  },
  deleteIcon: {
    paddingLeft: 5,
    paddingRight: 5,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    height: '50%',
  },
  contentNone: {
    height: '95%',
  },
  none: {
    textAlign: 'center',
    marginTop: '10%',
    color: '#888',
  },
  list: {},
});

const mapStateToProps = state => {
  return {
    videoList: state.videoList,
  };
};

// const mapDispatchToProps = dispatch => {
//   return {
//     saveVideo: data => dispatch({type: 'saveVideo', data}),
//   };
// };

export default connect(mapStateToProps)(VideoList);
