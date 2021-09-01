import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ToastAndroid,
} from 'react-native';
import Loading from '../../components/Loading';
import {connect} from 'react-redux';
import http from '../../http';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      loading: false,
    };
  }

  componentDidMount() {
    // if (!this.props.token) {
    //   return this.props.navigation.navigate('Login');
    // } else {
    //   this.getIndexList();
    // }
    this.getIndexList();
  }

  getIndexList() {
    this.setState({loading: true});
    http
      .getRecTaskList()
      .then(res => {
        this.setState({loading: false});
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
        this.setState({loading: false});
      });
  }

  toList(item) {
    this.props.navigation.navigate('List', item);
  }

  render() {
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
    return (
      <View style={styles.home}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        {this.state.loading && <Loading />}
        <FlatList
          data={this.state.list}
          renderItem={data => {
            return (
              <TouchableOpacity
                style={styles.box}
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

const mapStateToProps = state => {
  return {
    token: state.app.token,
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
