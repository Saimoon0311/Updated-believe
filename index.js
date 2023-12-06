/**
 * @format
 */

import React from 'react';
import {AppRegistry, Text, TextInput, View} from 'react-native';
import App from './App';
import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import TrackPlayer from 'react-native-track-player';
import {MenuProvider} from 'react-native-popup-menu';
import messaging from '@react-native-firebase/messaging';

// Remove ReactDOM since it's for web, not for React Native

const Believe = () => {
  return (
    <Provider store={store}>
      <MenuProvider>
        <App />
      </MenuProvider>
    </Provider>
  );
};

// Register Terminate handler
// messaging()
//   .getInitialNotification()
//   .then(remoteMessage => {
//     console.log(
//       'Notification caused app to open from quit state:',
//       remoteMessage,
//     );

//     // store.dispatch(setNotificationLength(remoteMessage));
//   });
AppRegistry.registerComponent(appName, () => Believe);
TrackPlayer.registerPlaybackService(() => require('./src/services/Services'));

//ADD this
if (Text.defaultProps == null) {
  Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
}

if (TextInput.defaultProps == null) {
  TextInput.defaultProps = {};
  TextInput.defaultProps.allowFontScaling = false;
}

if (View.defaultProps == null) {
  View.defaultProps = {};
  View.defaultProps.allowFontScaling = false;
}
