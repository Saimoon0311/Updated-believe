import React, {useEffect, useRef, useState} from 'react';
import {
  verifyUser,
  fcmTokenAction,
  getUser,
} from './src/store/actions/auth-action';
import useReduxStore from './src/hooks/useReduxStore';
import {NavigationContainer} from '@react-navigation/native';
import NavigationService from './src/services/NavigationService';
// import {
//   GAMBannerAd,
//   BannerAdSize,
//   TestIds,
// } from 'react-native-google-mobile-ads';
import Apptwo from './Apptwo';
import analytics from '@react-native-firebase/analytics';
import {getValue} from './src/services/storage';
import {Platform} from 'react-native';
import TrackPlayer from 'react-native-track-player';

const App = () => {
  const {dispatch, getState} = useReduxStore();
  const previousRouteName = useRef(null);
  // const {isLogin} = getState('Auth');

  /**
   * The function `googleAnalyticsFirebase` enables analytics collection and retrieves the app instance
   * ID using the Firebase Analytics library in JavaScript.
   */
  const googleAnalyticsFirebase = async () => {
    const appInstanceId = await analytics().app();
    analytics().setAnalyticsCollectionEnabled(true);
    // const appInstanceId = await firebase.analytics().getAppInstanceId();
    await analytics().setAnalyticsCollectionEnabled(true);
  };

  /* The `useEffect` hook is used to perform side effects in a functional component. In this case, the
`useEffect` hook is being used to call the `googleAnalyticsFirebase` function and dispatch the
`getUser` action when the component mounts. */
  useEffect(() => {
    googleAnalyticsFirebase();
    dispatch(getUser());
  }, []);
  return (
    <NavigationContainer
      ref={ref => {
        NavigationService.setRef(ref);
        // const p = NavigationService.getCurrentRoute(ref.getCurrentRoute());
      }}
      onReady={() => {
        const getNameFunc = NavigationService.getCurrentRoute();
        const routeName = getNameFunc?.getCurrentRoute()?.name;
        previousRouteName.current = routeName;
      }}
      onStateChange={async () => {
        const getNameFunc = NavigationService.getCurrentRoute();
        const currentRouteName = getNameFunc?.getCurrentRoute()?.name;
        if (previousRouteName.current !== currentRouteName) {
          const y = await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
          console.log('yyyyyyyyyyyyyyyyy', y);
        }
        previousRouteName.current = currentRouteName;
      }}>
      <Apptwo />
    </NavigationContainer>
  );
};

export default App;
