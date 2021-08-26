import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

export default class VideoList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log(this.props.params);
  }

  clickBlank = () => {
    this.props.isShowVideoList(false);
  };

  render() {
    const {params} = this.props;
    return (
      <View style={styles.page}>
        <TouchableOpacity style={styles.blank} onPress={this.clickBlank} />
        <View style={styles.main}>
          <Text style={styles.title}>{params.title}</Text>
          <View>
            <Text>{params.title}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  page: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    display: 'flex',
  },
  blank: {
    width: '100%',
    height: 150,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
  },
});
