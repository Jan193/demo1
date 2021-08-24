import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    backgroundColor: 'transparent',
    paddingTop: '40%',
  },
  loadingBox: {
    width: 100,
    height: 100,
    lineHeight: 100,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loading: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  text: {
    textAlign: 'center',
    color: '#fff',
    marginBottom: 5,
  },
});

const Loading = props => {
  return (
    <View style={styles.box}>
      <View style={styles.loadingBox}>
        <ActivityIndicator
          style={styles.loading}
          size="large"
          color="#fff"
          width="100"
          height="100"
        />
        {props.text && <Text style={styles.text}>{props.text}</Text>}
      </View>
    </View>
  );
};

export default Loading;
