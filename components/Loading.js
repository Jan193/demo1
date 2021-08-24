import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    backgroundColor: '#fff',
    paddingTop: '40%',
  },
});

const Loading = () => {
  return (
    <View style={styles.box}>
      <View style={styles.loadingBox}>
        <ActivityIndicator
          size="large"
          color="#0000ff"
          width="100"
          height="100"
        />
      </View>
    </View>
  );
};

export default Loading;
