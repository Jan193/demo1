/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {View} from 'react-native';
// import {Navigation} from 'react-native-navigation';

import Home from './views/home';
const App = () => {
  return (
    <View>
      {/* <Home /> */}
      test
    </View>
  );
};
// Navigation.events().registerAppLaunchedListener(async () => {
//   Navigation.setRoot({
//     root: {
//       stack: {
//         children: [
//           {
//             component: {
//               name: 'home',
//             },
//           },
//         ],
//       },
//     },
//   });
// });
// Navigation.registerComponent('index', () => App);
export default App;
