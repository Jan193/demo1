import axios from 'axios';
import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import Loading from '../../components/Loading';
import {connect} from 'react-redux';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.getToken();
  }

  getToken() {
    axios
      .get('https://yist.bfwit.net/JAI/wx/user/platUserLogin', {
        params: {
          id: '184113',
        },
      })
      .then(res => {
        if (res.data.code === 0) {
          this.props.saveToken(res.data.token);
          this.getIndexList(res.data.token);
        } else {
          Alert.alert('提示', res.data.msg);
          this.setState({loading: false});
        }
      })
      .catch(err => {
        Alert.alert('错误提示', err);
        this.setState({loading: false});
      });
  }

  getIndexList(token) {
    console.log('token::', token);
    axios
      .get('https://yist.bfwit.net/JAI/wx/record/getRecTaskList', {
        headers: {
          token: token,
        },
      })
      .then(res => {
        this.setState({loading: false});
        if (res.data.code === 0) {
          console.log(res.data.data);
          this.setState({list: res.data.data});
        } else {
          Alert.alert('提示', res.data.msg);
        }
      })
      .catch(err => {
        Alert.alert('错误提示', err);
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
    token: state.token,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    saveToken: data => dispatch({type: 'saveToken', data}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
