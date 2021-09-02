import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  VirtualizedList,
  SafeAreaView,
  StatusBar,
  ToastAndroid,
} from 'react-native';
import http from '../../http';
import Loading from '../../components/Loading';

const padding = 10;
const statusBarHeight = parseInt(StatusBar.currentHeight, 10) + 50;

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      list: [],
      refreshing: false,
      currentData: {},
    };
  }
  componentDidMount() {
    this.getCurrentDetail();
    this.getIndexList();
  }

  getCurrentDetail = () => {
    const {params} = this.props.route;
    http.getRecTaskList().then(({data}) => {
      if (data.code === 0) {
        for (let item of data.data) {
          if (item.id === params.id) {
            this.setState({currentData: item});
            break;
          }
        }
      }
    });
  };

  getIndexList = () => {
    this.setState({loading: true});
    const {params} = this.props.route;
    http
      .getRecTaskSampleList({fk_rec_id: params.id})
      .then(res => {
        this.setState({loading: false, refreshing: false});
        if (res.data.code === 0) {
          this.setState({list: res.data.data});
        } else {
          Alert.alert('提示', res.data.msg);
        }
      })
      .catch(err => {
        Alert.alert('错误提示', err);
        this.setState({loading: false, refreshing: false});
      });
  };

  toDetail = (data, index) => {
    this.props.navigation.navigate('Detail', {
      ...data,
      _index: index,
      _list: this.state.list,
    });
  };

  getItem = (data, index) => {
    return {
      ...data,
    };
  };

  renderItem = data => {
    const {index} = data;
    const item = data.item[index];
    return (
      <TouchableOpacity
        style={styles.box}
        activeOpacity={0.8}
        onPress={() => this.toDetail(item, index)}>
        <Text style={styles.boxTitle}>
          {index + 1}. {item.title}
        </Text>
        {item.content_status === 2 && (
          <Text style={styles.recorded}>已录制</Text>
        )}
        <Text style={styles.content}>{item.content}</Text>
      </TouchableOpacity>
    );
  };

  keyExtractor = (data, index) => {
    return index;
  };

  completeButton = () => {
    const {params} = this.props.route;
    if (params.complete_num > 0) {
      http
        .updateRecBatchStatus({
          id: this.props.route.params.id,
          rec_status: 4,
        })
        .then(response => {
          if (response.data.code === 0) {
            ToastAndroid.show('提交成功', ToastAndroid.TOP);
          } else {
            ToastAndroid.show(
              '提交失败:' + response.data.msg,
              ToastAndroid.TOP,
            );
          }
        })
        .catch(error => {
          ToastAndroid.show('更新状态报错:' + error.message, ToastAndroid.TOP);
        });
    } else {
      ToastAndroid.show('还未录制任务', ToastAndroid.TOP);
    }
  };

  onRefresh = () => {
    this.setState({refreshing: true});
    this.getIndexList();
  };

  render() {
    const {currentData} = this.state;
    return (
      <SafeAreaView style={styles.page}>
        <View>
          {this.state.loading && <Loading />}
          <View style={styles.top}>
            <Text style={styles.title}>
              {currentData.title}({currentData.complete_num}/
              {currentData.selected_num})
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.completeButton()}>
              <Text style={styles.buttonText}>完成</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.main}>
            <VirtualizedList
              style={styles.listContainer}
              data={this.state.list}
              initialNumToRender={5}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              getItemCount={() => this.state.list.length}
              getItem={this.getItem}
              onRefresh={this.onRefresh}
              refreshing={this.state.refreshing}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  top: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding,
    height: 50,
  },
  title: {
    color: '#daa520',
    marginRight: 10,
    fontSize: 16,
  },
  buttonBox: {
    width: 50,
    height: 30,
    fontSize: 12,
  },
  button: {
    borderRadius: 4,
    backgroundColor: '#1CB84B',
  },
  buttonText: {
    width: 50,
    height: 30,
    lineHeight: 30,
    textAlign: 'center',
    fontSize: 12,
    color: '#fff',
  },

  main: {
    marginBottom: statusBarHeight,
  },
  listContainer: {
    // marginBottom: 60,
    height: '100%',
  },
  box: {
    marginBottom: 10,
    backgroundColor: '#fff',
    padding,
  },
  boxTitle: {
    marginBottom: padding,
    fontSize: 15,
  },
  content: {
    color: '#555',
  },
  recorded: {
    width: 50,
    height: 25,
    lineHeight: 25,
    textAlign: 'center',
    borderRadius: 4,
    backgroundColor: '#58BD6A',
    color: '#fff',
  },
});

export default List;
