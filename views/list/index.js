import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  // FlatList,
  VirtualizedList,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const padding = 10;
const statusBarHeight = parseInt(StatusBar.currentHeight) + 50;

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  top: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding,
    height: 50,
  },
  title: {
    color: '#daa520',
    marginRight: 10,
  },
  buttonBox: {
    width: 50,
    height: 30,
    fontSize: 12,
  },
  button: {
    borderRadius: 4,
    backgroundColor: '#1CB84B',
  },
  buttonText: {
    width: 50,
    height: 30,
    lineHeight: 30,
    textAlign: 'center',
    fontSize: 12,
    color: '#fff',
  },

  main: {
    marginBottom: statusBarHeight,
  },
  listContainer: {
    // marginBottom: 60,
    height: '100%',
  },
  box: {
    marginBottom: 10,
    backgroundColor: '#fff',
    padding,
  },
  boxTitle: {
    marginBottom: padding,
    fontSize: 15,
  },
  content: {
    color: '#555',
  },
});

const List = ({navigation, route}) => {
  const {params} = route;
  const list = [
    {
      id: 1,
      name: '16岁血压高，该怎么查？',
      content:
        '十六岁就得高血压，实际上是一个比较少见的情况，第一查一下四肢的血压。',
    },
    {
      id: 2,
      name: '高血压正常，低血压怎么办？',
      content:
        '十六岁就得高血压，实际上是一个比较少见的情况，第一查一下四肢的血压。',
    },
    {
      id: 3,
      name: '高血压正常，低血压怎么办？',
      content:
        '十六岁就得高血压，实际上是一个比较少见的情况，第一查一下四肢的血压。',
    },
    {
      id: 4,
      name: '高血压正常，低血压怎么办？',
      content:
        '十六岁就得高血压，实际上是一个比较少见的情况，第一查一下四肢的血压。',
    },
    {
      id: 5,
      name: '高血压正常，低血压怎么办？',
      content:
        '十六岁就得高血压，实际上是一个比较少见的情况，第一查一下四肢的血压。',
    },
    {
      id: 6,
      name: '高血压正常，低血压怎么办？',
      content:
        '十六岁就得高血压，实际上是一个比较少见的情况，第一查一下四肢的血压。',
    },
    {
      id: 7,
      name: '高血压正常，低血压怎么办？',
      content:
        '十六岁就得高血压，实际上是一个比较少见的情况，第一查一下四肢的血压。',
    },
    {
      id: 8,
      name: '高血压正常，低血压怎么办？',
      content:
        '十六岁就得高血压，实际上是一个比较少见的情况，第一查一下四肢的血压。',
    },
    {
      id: 9,
      name: '高血压正常，低血压怎么办？',
      content:
        '十六岁就得高血压，实际上是一个比较少见的情况，第一查一下四肢的血压。',
    },
    {
      id: 10,
      name: '高血压正常，低血压怎么办？？',
      content:
        '十六岁就得高血压，实际上是一个比较少见的情况，第一查一下四肢的血压。',
    },
  ];

  const toDetail = data => {
    navigation.navigate('Detail', data);
  };

  const getItem = (data, index) => {
    return {
      ...data,
    };
  };

  const renderItem = data => {
    const {index} = data;
    const item = data.item[index];
    return (
      <TouchableOpacity style={styles.box} onPress={() => toDetail(item)}>
        <Text style={styles.boxTitle}>
          {index + 1}. {item.name}
        </Text>
        <Text style={styles.content}>{item.content}</Text>
      </TouchableOpacity>
    );
  };

  const keyExtractor = (data, index) => {
    console.log('index::', data[index]);
    return index;
  };
  return (
    <SafeAreaView style={styles.page}>
      <View>
        <View style={styles.top}>
          <Text style={styles.title}>
            {params.name}({params.recorded}/{params.total})
          </Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>完成</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.main}>
          {/* <FlatList
            style={styles.listContainer}
            data={list}
            renderItem={data => {
              const {item, index} = data;
              return (
                <TouchableOpacity
                  style={styles.box}
                  onPress={() => toDetail(item)}>
                  <Text style={styles.boxTitle}>
                    {index + 1}. {item.name}
                  </Text>
                  <Text style={styles.content}>{item.content}</Text>
                </TouchableOpacity>
              );
            }}
          /> */}
          <VirtualizedList
            style={styles.listContainer}
            data={list}
            initialNumToRender={5}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemCount={() => list.length}
            getItem={getItem}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default List;
