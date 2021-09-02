import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ToastAndroid,
  BackHandler,
} from 'react-native';
import Loading from '../../components/Loading';
import {connect} from 'react-redux';
import http from '../../http';
import storage from '../../js/storage';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      loading: true,
      refreshing: false,
    };
  }

  lastTime = 0;

  componentDidMount() {
    storage
      .load({key: 'userInfo'})
      .then(res => {
        if (res && res.token) {
          this.getIndexList();
        } else {
          this.props.navigation.navigate('Login');
        }
      })
      .catch(err => {
        console.log('加载存储数据错误:', err);
        this.props.navigation.navigate('Login');
      });

    BackHandler.addEventListener('back', this.backHandle);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('back', this.backHandle);
    this.lastTime = 0;
  }

  backHandle = () => {
    const data = this.props.navigation.getState();
    if (data.index === 1) {
      let time = Date.now();
      if (time - this.lastTime <= 2000) {
        BackHandler.exitApp();
        return false;
      } else {
        ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
        this.lastTime = time;
        return true;
      }
    } else {
      return false;
    }
  };

  getIndexList() {
    this.setState({loading: true});
    http
      .getRecTaskList()
      .then(res => {
        this.setState({loading: false, refreshing: false});
        if (res.data.code === 0) {
          this.setState({list: res.data.data});
        } else if (res.data.code === -1) {
          ToastAndroid.show(res.data.msg, ToastAndroid.TOP);
          this.props.navigation.navigate('Login');
        } else {
        }
      })
      .catch(err => {
        ToastAndroid.show(err.message, ToastAndroid.TOP);
        this.setState({loading: false, refreshing: false});
      });
  }

  toList(item) {
    this.props.navigation.navigate('List', item);
  }

  onRefresh = () => {
    this.setState({refreshing: true});
    this.getIndexList();
  };

  render() {
    return (
      <View style={styles.home}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        {this.state.loading && <Loading />}
        <FlatList
          data={this.state.list}
          onRefresh={this.onRefresh}
          refreshing={this.state.refreshing}
          renderItem={data => {
            return (
              <TouchableOpacity
                style={styles.box}
                activeOpacity={0.8}
                onPress={this.toList.bind(this, data.item)}>
                <Text style={styles.boxTitle}>{data.item.title}</Text>
                <Text>
                  总数量：{data.item.selected_num}，已录制：
                  {data.item.complete_num}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    minHeight: '100%',
  },
  box: {
    backgroundColor: '#fff',
    marginTop: 6,
    padding: 10,
  },
  boxTitle: {
    marginBottom: 5,
    fontSize: 15,
    color: '#666',
  },
});

const mapStateToProps = state => {
  return {
    token: state.app.token,
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
