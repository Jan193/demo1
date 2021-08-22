/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Suspense} from 'react';
import {View, StyleSheet} from 'react-native';
import {Provider} from 'react-redux';
import store from './redux';
import Home from './views/home/index.js';

const styles = StyleSheet.create({
  app: {
    minHeight: '100%',
  },
});

const App = () => {
  return (
    <Provider store={store}>
      <Suspense>
        <View style={styles.app}>
          <Home />
        </View>
      </Suspense>
    </Provider>
  );
};
export default App;
