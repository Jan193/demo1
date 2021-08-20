/**
 * @format
 */

// import {AppRegistry} from 'reactnative';
// import App from './App';
// import {name as appName} from './app.json';
// AppRegistry.registerComponent(appName, () => App);

import {Navigation} from 'reactnativenavigation';
// import {AppRegistry} from 'reactnative';
import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);
Navigation.registerComponent('com.myApp.WelcomeScreen', () => App);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'com.myApp.WelcomeScreen',
            },
          },
        ],
      },
    },
  });
});
