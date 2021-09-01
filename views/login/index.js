import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import http from '../../http';
import globalData from '../../redux/data';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      code: '',
      time: 60,
      showTime: false,
      showSend: true,
    };
  }

  timer = null;

  componentDidMount() {
    if (this.props.token) {
      return this.props.navigation.navigate('Home');
    }
  }

  login = () => {
    http
      .loginByMobile({
        mobile: this.state.phoneNumber,
        verificationCode: this.state.code,
      })
      .then(async response => {
        console.log('登录请求:', response.data);
        const responseData = response.data;
        if (responseData.code === 0) {
          await this.props.saveToken(responseData.token);
          // this.props.saveUserInfo(responseData.data);
          console.log('存储完成获取：', this.props.token);
          globalData.token = responseData.token;
          if (this.props.token) {
            this.props.navigation.navigate('Home');
          }
        } else {
          ToastAndroid.show(responseData.msg, ToastAndroid.TOP);
        }
      })
      .catch(error => {
        console.log('登录错误:', error);
        ToastAndroid.show(error.message, ToastAndroid.TOP);
      });
  };

  getTime = () => {
    let start = 60;
    this.timer = setInterval(() => {
      if (start <= 0) {
        this.setState({showTime: false});
        return clearInterval(this.timer);
      }
      start -= 1;
      this.setState({time: start});
    }, 1000);
  };

  sendCode = () => {
    if (this.isPoneAvailable(this.state.phoneNumber)) {
      this.setState({
        showSend: false,
        showTime: true,
      });
      this.getTime();
      http
        .getVerificationCode({mobile: this.state.phoneNumber})
        .then(response => {
          console.log(response.data);
          if (response.data.code === 0) {
            this.setState({
              showTime: false,
              showSend: false,
              code: response.data.data,
            });
            clearInterval(this.timer);
          } else {
            ToastAndroid.show(response.data.msg, ToastAndroid.TOP);
          }
        })
        .catch(error => {
          ToastAndroid.show(error.message, ToastAndroid.TOP);
        });
    } else if (!this.state.phoneNumber) {
      ToastAndroid.show('请输入手机号', ToastAndroid.TOP);
    } else {
      ToastAndroid.show('手机号格式不正确', ToastAndroid.TOP);
    }
  };

  isPoneAvailable = value => {
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(value)) {
      return false;
    } else {
      return true;
    }
  };

  render() {
    const {phoneNumber, code, showTime, time, showSend} = this.state;
    return (
      <View style={styles.page}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <View style={styles.row}>
          <Text style={styles.label}>手机号</Text>
          <TextInput
            style={styles.input}
            defaultValue={phoneNumber}
            placeholder="请输入手机号"
            onChangeText={value => this.setState({phoneNumber: value})}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>验证码</Text>
          <TextInput
            style={styles.input}
            defaultValue={code}
            onChangeText={value => this.setState({code: value})}
            placeholder="请输入验证码"
            keyboardType="numeric"
          />
          {showTime && <Text style={styles.time}>{time}</Text>}
          {showSend && (
            <TouchableOpacity style={styles.sendButton} onPress={this.sendCode}>
              <Text style={styles.sendText}>发送</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.buttonBox}>
          <TouchableOpacity style={styles.button} onPress={this.login}>
            <Text style={styles.buttonText}>登录</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  page: {
    height: '100%',
    backgroundColor: '#fff',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  time: {
    width: 70,
    height: 35,
    lineHeight: 35,
    backgroundColor: '#ABDFB4',
    marginLeft: 'auto',
    textAlign: 'center',
    color: '#fff',
  },
  buttonBox: {
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 40,
  },
  button: {
    width: '100%',
    backgroundColor: '#58BD6A',
    borderRadius: 4,
  },
  buttonText: {
    height: 45,
    lineHeight: 45,
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
  },
  sendButton: {
    backgroundColor: '#58BD6A',
  },
  sendText: {
    width: 70,
    height: 35,
    lineHeight: 35,
    textAlign: 'center',
    color: '#fff',
  },
});

const mapStateToProps = state => {
  return {
    token: state.app.token,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    saveToken: data => dispatch({type: 'saveToken', data: data}),
    // saveUserInfo: data => dispatch({type: 'saveUserInfo', data}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
