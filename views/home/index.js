import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Loading from '../../components/Loading';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      loading: true,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState(
        {
          list: [
            {name: '2021年第二次样片推荐', total: 5, recorded: 0, id: 1},
            {name: '2021年第一次样片推荐', total: 2, recorded: 0, id: 2},
            {name: '2021年第一次样片推荐', total: 2, recorded: 0, id: 3},
            {name: '2021年第一次样片推荐', total: 2, recorded: 0, id: 4},
            {name: '2021年第一次样片推荐', total: 2, recorded: 0, id: 5},
            {name: '2021年第一次样片推荐', total: 2, recorded: 0, id: 6},
            {name: '2021年第一次样片推荐', total: 2, recorded: 0, id: 7},
            {name: '2021年第一次样片推荐', total: 2, recorded: 0, id: 8},
            {name: '2021年第一次样片推荐', total: 2, recorded: 0, id: 9},
            {name: '2021年第一次样片推荐', total: 2, recorded: 0, id: 10},
            {name: '2021年第一次样片推荐', total: 2, recorded: 0, id: 11},
            {name: '2021年第十次样片推荐', total: 2, recorded: 0, id: 12},
          ],
        },
        () => {
          this.setState({loading: false});
        },
      );
    }, 1000);
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
                <Text style={styles.boxTitle}>{data.item.name}</Text>
                <Text>
                  总数量：{data.item.total}，已录制：{data.item.recorded}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }
}

export default Home;
