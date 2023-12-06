import React, {useEffect, useRef, useState} from 'react';
import {
  LogBox,
  Text,
  TextInput,
  View,
  AppState,
  Image,
  Platform,
  PushNotificationIOS,
  Alert,
  NativeModules,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {screensEnabled, enableFreeze} from 'react-native-screens';
import {
  verifyUser,
  fcmTokenAction,
  getUser,
} from './src/store/actions/auth-action';
import Navigation from './src/navigation/Navigation';
import useReduxStore from './src/hooks/useReduxStore';
import Overlay from './src/components/Overlay';
import {
  getOnBoardToken,
  getValue,
  hasKey,
  storeValue,
} from './src/services/storage';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';
import {fcmService} from './src/services/Notifications';
import TrackPlayer, {Event} from 'react-native-track-player';
import {playMusic, toggleMusic} from './src/store/actions/music-action';
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
} from 'react-native-reanimated';
import {splash, splashIphone} from './src/Assets/lottie';
import * as Images from './src/Assets/Images';
import cache from './src/utils/helper/cache';
import Orientation, {
  OrientationLocker,
  PORTRAIT,
} from 'react-native-orientation-locker';
import API from './src/services/API';
import OneSignal from 'react-native-onesignal';
import {useFocusEffect, useIsFocused, useRoute} from '@react-navigation/native';
import {toggleControls} from './src/store/actions/control-action';
import Purchases, {LOG_LEVEL} from 'react-native-purchases';
import Gleap from 'react-native-gleapsdk';
import sagaTypes from './src/store/saga-types';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  checkLocationAccuracy,
} from 'react-native-permissions';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import analytics from '@react-native-firebase/analytics';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
// import musicSwitch from './src/store/sagas/music-saga';
import {musicSwitch} from './src/utils/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';

enableFreeze(true);
screensEnabled(true);
const flexStyle = {flex: 1};
const preloadImages = () => {
  const images = [
    Images.background,
    Images.homeBackground,
    Images.profileBackground,
    Images.OnBoard1,
    Images.OnBoard2,
    Images.OnBoard3,
  ];

  const uris = images.map(image => ({
    uri: Image.resolveAssetSource(image).uri,
  }));
  FastImage.preload(uris);
};

LogBox.ignoreLogs([
  'Settings is not yet supported on Android',
  'ViewPropTypes will be removed',
  "exported from 'deprecated-react-native-prop-types'.",
  'Sending...',
  'Non-serializable values were found in the navigation state',
]);

const AppTwo = () => {
  const {dispatch, getState} = useReduxStore();
  const {loading, isLogin, appMusic, showAnimatedSplash} = getState('Auth');
  const sessionData = getState('sessionReducer');
  const appState = useRef(AppState.currentState);
  const onBoard = getOnBoardToken();
  const [splashIsLoaded, setSplashIsLoaded] = useState(false);
  const [hitFirst, setHitFirst] = useState(false);
  const [userInfo, setUserInfo] = useState();

  /**
   * The function sets the notification sound by making a POST request to the '/notification-tune'
   * endpoint with the specified tune.
   */
  const setNotifcationSound = async type => {
    await API.post('/notification-tune', {
      tune: type,
    });
  };
  /**
   * The function `setValueInRedux` retrieves a value from an element with the id 'hitControlFirst' and
   * dispatches an action to toggle controls in Redux with that value.
   */
  const setValueInRedux = () => {
    const controlVal = getValue('hitControlFirst');
    dispatch(toggleControls(controlVal));
  };

  /* The above code is written in JavaScript and is using the useEffect hook from React. */
  useEffect(() => {
    hasKey('hitControlFirst')
      ? setValueInRedux()
      : storeValue('hitControlFirst', 'false');

    // const subscription = AppState.addEventListener('change', stat => {
    //   if (stat !== 'active' && stat !== 'background') {
    //     setAndGetMusicVal('hitFirst', 'true');
    //   }
    // });
    // return () => {
    //   subscription.remove();
    // };
  }, []);

  /**
   * The function `requestPermission` is an asynchronous function that requests permission for app
   * tracking transparency on iOS and logs the result.
   */
  const requestPermissiom = async () => {
    const req = await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
    console.log('jsdbvjkbdsjkvbdsjkbvdjksbvbsdsddsbsdfdds', req);
  };

  /**
   * The function sets up a player for playing tracks asynchronously.
   */
  const player = async () => {
    // const checkBG = Boolean(getValue('background') == 'true');
    // if (checkBG) {
    await TrackPlayer.setupPlayer();
    // }
  };

  /* The above code is written in JavaScript and is using the useEffect hook from React. */
  useEffect(() => {
    /* It's a function that registers the device to receive push notifications. */
    if (isLogin)
      fcmService.register(onRegister, onOpenNotification, appState.current);

    // return () => {
    //   /* It's a function that unregisters the device from receiving push notifications. */
    //   if (isLogin) fcmService.unRegister();
    // };
  }, [isLogin]);

  useEffect(() => {
    return async () => {
      if (Platform.OS == 'android') await TrackPlayer.reset();
      // const track = await TrackPlayer.getCurrentTrack();
      // console.log('djsbjkbdsjkvbdjkbvjbdvbd', track);
      //  await TrackPlayer.updateOptions
      // storeValue('hitFirst', 'true');
    };
  }, []);

  /**
   * The function "onRegister" dispatches an action with the FCM token as a parameter.
   */
  const onRegister = fcm_token => {
    dispatch(fcmTokenAction({fcm_token}));
  };

  const onOpenNotification = notify => {
    console.log('notify', notify);
  };
  /* The above code is checking if the variable `savesFiles` is null, undefined, or an empty object. If
it is, it stores an empty array in the cache with the key 'downloadedFiles'. */

  useEffect(() => {
    const savesFiles = cache.get('downloadedFiles');
    if (savesFiles == null || savesFiles == undefined || savesFiles == {}) {
      cache.store('downloadedFiles', []);
    }
  }, []);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        // '360199194045-25456ipe52269s504e1vl13i4vk80cgl.apps.googleusercontent.com',
        // '360199194045-a12ll3m7g5k2aritr98n1pb3p704evlu.apps.googleusercontent.com',
        // '360199194045-a12ll3m7g5k2aritr98n1pb3p704evlu.apps.googleusercontent.com',
        // '360199194045-onss1bavvl3s6bk6eghvtd2qgbk9dd41.apps.googleusercontent.com',
        // '360199194045-25456ipe52269s504e1vl13i4vk80cgl.apps.googleusercontent.com',
        '360199194045-a12ll3m7g5k2aritr98n1pb3p704evlu.apps.googleusercontent.com',
      // '360199194045-a12ll3m7g5k2aritr98n1pb3p704evlu.apps.googleusercontent.com',
    });
  });

  /* The above code is a JavaScript code snippet that is using the `useEffect` hook in a React
  component. */
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        const bgMusic = await AsyncStorage.getItem('bgMusic');
        const playerState = await TrackPlayer.getState();
        // stateRef.current = playerState;
        console.log(
          'PausedPausedPausedPausedPausedPaused',
          appState.current,
          bgMusic,
          playerState,
          nextAppState,
        );
        if (bgMusic == 'true' && nextAppState.match(/background/)) {
          await TrackPlayer.updateOptions({stopWithApp: true});
          await TrackPlayer.reset();
        } else if (
          (playerState == 'paused' || playerState == 'idle') &&
          bgMusic == 'true' &&
          nextAppState.match(/active/)
        ) {
          console.log('ksksbndk');
          await musicSwitch(true);
        }
        // if (appMusic) {
        //   console.log('appMusic', appMusic);
        //   if (
        //     appState.current.match(/background/) &&
        //     nextAppState == 'active' &&
        //     appMusic
        //   ) {
        //     console.log('play music');
        //     dispatch(toggleMusic({play: false}));
        //   } else if (
        //     ['inactive', 'unknown'].includes(nextAppState) &&
        //     // nextAppState == 'inactive' &&
        //     Platform.OS == 'android'
        //   ) {
        //     console.log('off music=============');
        //     // storeValue('hitFirst', 'false');
        //     // TrackPlayer.pause();
        //     dispatch(toggleMusic({play: true}));
        //   }
        // }
        appState.current = nextAppState;
        fcmService.setBadge();
      },
    );

    return () => {
      subscription.remove();
    };
  }, [appState.current]);

  /* The above code is written in JavaScript and is using the useEffect hook from React. */
  useEffect(() => {
    requestPermissiom();
    TrackPlayer.addEventListener(Event.PlaybackQueueEnded, () => {
      if (appMusic) {
        TrackPlayer.seekTo(0);
        TrackPlayer.play();
      }
    });
  }, []);

  /**
   * The above function configures the OneSignal library for handling push notifications in a
   * JavaScript application.
   */
  const oneSignalConfig = () => {
    OneSignal.setAppId('140d55c0-a689-4801-b26a-d1bae33ca9ad'); //   live keys for new bundle id
    // OneSignal.setAppId('33d8bd39-ae76-401d-b85f-3fca4ed06ac1'); //   live keys
    // OneSignal.setAppId('f3d65f8c-74da-49d4-b21d-daa3f48cb30c');  //  test keys
    OneSignal.promptForPushNotificationsWithUserResponse();

    //Method for handling notifications received while app in foreground
    OneSignal.setNotificationWillShowInForegroundHandler(
      notificationReceivedEvent => {
        console.log(
          'OneSignal: notification will show in foreground:',
          notificationReceivedEvent,
        );
        let notification = notificationReceivedEvent.getNotification();
        console.log('notification: ', notification);
        const data = notification.additionalData;
        console.log('additionalData: ', data);
        // Complete with null means don't show a notification.
        notificationReceivedEvent.complete(notification);
      },
    );

    //Method for handling notifications opened
    OneSignal.setNotificationOpenedHandler(notification => {
      console.log('OneSignal: notification opened:', notification);
    });
  };

  /**
   * The function `revenewCat` configures the Purchases library with the appropriate API key based on
   * the platform (iOS or Android).
   */
  const revenewCat = async () => {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    const configured = await Purchases.isConfigured();
    if (Platform.OS === 'ios') {
      await Purchases.configure({apiKey: 'appl_SbKTAsGaHRkYSxfgigFWvLtrYed'});
    } else if (Platform.OS === 'android') {
      await Purchases.configure({apiKey: 'goog_zVmRcmkWtsEyTSxouECGkmOATcz'});
    }
  };

  /**
   * The function initializes the Gleap SDK with a specific API key.
   */
  const gleapConfig = () => {
    Gleap.initialize('kE48womn33qHapQNb8prKP3mKBtWmkCp');
  };

  /**
   * The function `googleAnalyticsFirebase` enables analytics collection using Firebase in a JavaScript
   * application.
   */
  const googleAnalyticsFirebase = async () => {
    // await firebase.analytics().app();
    analytics().app();
    // console.log(
    //   'appInstanceIdappInstanceIdappInstanceIdappInstanceIdappInstanceIdappInstanceIdappInstanceIdappInstanceId',
    //   appInstanceId,
    // );
    await analytics().setAnalyticsCollectionEnabled(true);
  };

  /* The above code is written in JavaScript and is using the useEffect hook from React. */
  useEffect(() => {
    googleAnalyticsFirebase();
    dispatch(getUser());
    dispatch(verifyUser());
    revenewCat();
    // googleAdsinit();
    /* It's a function that registers the device to receive push notifications. */
    oneSignalConfig();
    gleapConfig();
  }, []);

  /**
   * The function "setAndGetMusicVal" sets a value in a store and then retrieves the value from the
   * store.
   * @param key - The key parameter is a string that represents the key or identifier for the value you
   * want to store or retrieve.
   * @param val - The `val` parameter is the value that you want to store in the key-value store.
   * @returns The function `setAndGetMusicVal` returns the value associated with the given key after
   * setting the value in the store.
   */
  const setAndGetMusicVal = (key, val) => {
    storeValue(key, val);
    return getValue(key);
  };
  const isFousced = useIsFocused();

  const checkValSetup = async () => {
    console.log('rrrrrrrrrrrrrrrrrr', getValue('hitFirst'));
    let background = hasKey('hitFirst')
      ? getValue('hitFirst')
      : setAndGetMusicVal('hitFirst', 'true');
    console.log('jkdbcjkbdskcbdjkbcvdjklsbjkldsbjbdks', background);
    return background;
  };

  const hitIFCondition = async i => {
    if (i == 'true') {
      await player();
      storeValue('hitFirst', 'false');
      return true;
    }
  };

  useEffect(() => Orientation.lockToPortrait(), []);

  /* The above code is a useEffect hook in JavaScript. It is triggered whenever the value of the
"isFousced" variable changes. */
  useEffect(async () => {
    if (isFousced) {
      var background = hasKey('background')
        ? getValue('background') == 'true'
        : setAndGetMusicVal('background', 'true');
      await AsyncStorage.setItem('background', JSON.stringify(background));
      if (background == true) {
        const i = await checkValSetup();
        // console.log('iiiiiiii', i);
        Platform.OS == 'android' && (await hitIFCondition(i));
        Platform.OS == 'ios' && (await player());
        await musicSwitch(true);
        // dispatch(playMusic({appMusic: true}));
      }
    }
  }, [isFousced]);

  useEffect(() => {
    var session = hasKey('sessionData')
      ? getValue('sessionData')
      : setAndGetMusicVal('sessionData', JSON.stringify(sessionData));
    console.log('sessionsessionsessionsessionsession', session);
    // await AsyncStorage.setItem('sessionData', session);
    dispatch({
      type: sagaTypes.updateSessionData,
      payload: session,
    });
    // const asyncDate = await AsyncStorage.getItem(sessionData);
    // console.log('async storage data', asyncDate);
    // return () => console.log('hardClose data async storage', session);
  }, []);

  /* The above code is a useEffect hook in JavaScript. It is used to perform side effects in functional
 components. */
  useEffect(async () => {
    var background = hasKey('background')
      ? getValue('background') == 'true'
      : setAndGetMusicVal('background', 'true');
    await AsyncStorage.setItem('background', JSON.stringify(background));
    console.log('background,backgasdasdadadasdasdasround', background);
    if (background == true) {
      console.log('confirsdklnsdklvbdklsbvdsvklbdsklvbdsklbvdklsbvbdsvdksm');
      const i = await checkValSetup();
      // console.log('iiiiiiii', i);
      Platform.OS == 'android' && (await hitIFCondition(i));
      Platform.OS == 'ios' && (await player());
      musicSwitch(true);
      // dispatch(playMusic({appMusic: true}));
    }

    // var session = hasKey('sessionData')
    //   ? getValue('sessionData')
    //   : setAndGetMusicVal('sessionData', JSON.stringify(sessionData));

    // dispatch({
    //   type: sagaTypes.updateSessionData,
    //   payload: session,
    // });
    // const hiFirst = Boolean(hasKey('hitControlFirst'));

    // if (!hiFirst) setAndGetMusicVal('hitControlFirst', 'false');

    // if (background) dispatch(playMusic({appMusic: background}));

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    TextInput.defaultProps = TextInput.defaultProps || {};
    TextInput.defaultProps.allowFontScaling = false;
    View.defaultProps = View.defaultProps || {};
    View.defaultProps.allowFontScaling = false;
    preloadImages();
    /* It's a function that verifies if the user is logged in. */
  }, []);
  const isIpad = Boolean(
    Platform.OS == 'android' && Platform.isPad == undefined,
  );

  /* The above code is defining a variable called `IpadStyle` using a ternary operator. If the variable
  `isIpad` is true, it sets the `IpadStyle` object with specific properties for an iPad device. If
  `isIpad` is false, it sets the `IpadStyle` object with different properties for non-iPad devices.
  The properties include `backgroundColor`, `height`, and `width`, which are set using functions
  `heightPercentageToDP` and `widthPercentageToDP` to calculate the dimensions based on the device's
  screen size. */
  const IpadStyle = isIpad
    ? {
        backgroundColor: 'black',
        height: heightPercentageToDP('104'),
        // aspectRatio: 1,
        // flex: 1,
        width: widthPercentageToDP('130'),
        // marginTop: heightPercentageToDP('13'),
      }
    : {
        height: heightPercentageToDP('100'),
        // width: widthPercentageToDP('100'),
        backgroundColor: 'black',
      };

  return (
    <GestureHandlerRootView style={flexStyle}>
      <OrientationLocker orientation={PORTRAIT} />
      {!splashIsLoaded && (
        <Animated.View
          style={{
            flex: 1,
          }}
          entering={FadeIn.duration(300).delay(0)}
          exiting={FadeOut.duration(2000)}>
          <LottieView
            // source={splash}
            source={splashIphone}
            // source={!isIpad ? splash : splashIphone}
            autoPlay
            loop={false}
            onAnimationFinish={() => setSplashIsLoaded(true)}
            resizeMode={'contain'}
            // resizeMode={!isIpad ? 'contain' : 'cover'}
            // auto`S1ize
            style={{
              ...IpadStyle,
              alignSelf: 'center',
              aspectRatio: 1,
            }}
          />
        </Animated.View>
      )}

      {splashIsLoaded && (
        <Animated.View
          style={flexStyle}
          entering={FadeIn.duration(1500).delay(0)}
          exiting={FadeOut.duration(2000)}>
          <Navigation {...{isLogin, onBoard: 'true'}} />
          {loading && splashIsLoaded && <Overlay />}
        </Animated.View>
      )}
    </GestureHandlerRootView>
  );
};

export default AppTwo;
