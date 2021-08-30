/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
// import {View, StyleSheet, Text} from 'react-native';
import {Provider} from 'react-redux';
import store from './redux';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from './views/home/index.js';
import List from './views/list';
import Detail from './views/detail';
// import VideoPlayer from './views/videoPlay/video';
import VideoPlayer from './views/videoPlay/VideoPlayer';
import VideoList from './views/detail/videoList';
import Recording from './views/recording';

const RootStack = createNativeStackNavigator();

const headerOptions = {
  title: '医视通',
  headerTitleAlign: 'center',
};

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootStack.Navigator initialRouteName="Home">
          <RootStack.Screen
            name="Home"
            component={Home}
            options={{
              ...headerOptions,
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
};
export default App;
