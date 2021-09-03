/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Provider} from 'react-redux';
import store from './redux';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from './views/home/index.js';
import List from './views/list';
import Detail from './views/detail';
import VideoPlayer from './views/videoPlay/VideoPlayer';
import VideoList from './views/detail/videoList';
import Recording from './views/recording';
import Login from './views/login';
import storage from './js/storage';
import globalData from './redux/data';

const RootStack = createNativeStackNavigator();

const headerOptions = {
  title: '医视通',
  headerTitleAlign: 'center',
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
    };
  }

  componentDidMount() {
    storage
      .load({key: 'userInfo'})
      .then(async res => {
        if (res && res.token) {
          this.props.saveToken(res.token);
          globalData.token = res.token;
          await this.props.navigation.navigate('Home');
          // this.setState({isLogin: true});
        }
      })
      .catch(err => {
        console.log('加载存储数据错误login:', err);
        this.setState({isLogin: false});
      });
  }
  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <RootStack.Navigator initialRouteName="Login">
            <RootStack.Screen
              name="Login"
              component={Login}
              options={{
                ...headerOptions,
                title: '登录',
                headerBackVisible: false,
              }}
            />
            <RootStack.Screen
              name="Home"
              component={Home}
              options={{
                ...headerOptions,
                headerBackVisible: false,
                headerStyle: {
                  backgroundColor: '#fff',
                },
                headerTitleStyle: {
                  fontFamily: 'bold',
                  fontSize: 12,
                },
              }}
            />
            <RootStack.Screen
              name="List"
              component={List}
              options={{...headerOptions}}
            />
            <RootStack.Screen
              name="Detail"
              component={Detail}
              options={{...headerOptions}}
            />
            <RootStack.Screen
              name="VideoPlayer"
              component={VideoPlayer}
              options={{...headerOptions, headerShown: false}}
            />
            <RootStack.Screen
              name="VideoList"
              component={VideoList}
              options={{...headerOptions}}
            />
            <RootStack.Screen
              name="Recording"
              component={Recording}
              options={{...headerOptions, headerShown: false}}
            />
          </RootStack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App;
