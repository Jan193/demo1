/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import Home from './views/home/index.js';

const styles = StyleSheet.create({
  app: {
    minHeight: '100%',
  },
});

const App = () => {
  return (
    <View style={styles.app}>
      <Home />
    </View>
  );
};
export default App;
