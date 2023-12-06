import {asCalendarConsumer} from 'react-native-calendars';
import useReduxStore from '../../hooks/useReduxStore';
import {getValue} from '../../services/storage';
import {getAllRingtones} from '../../store/actions/content-action';
import {playMusic} from '../../store/actions/music-action';
import {useCallback, useEffect, useState} from 'react';
import {BackHandler, Platform} from 'react-native';
import TrackPlayer, {Capability, RepeatMode} from 'react-native-track-player';
import {TrackService} from '../../services/onboard-service';
import {musicSwitch} from '../../utils/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * The `useSoundSelect` function is a custom hook in JavaScript that handles the selection and playback
 * of sound options in a mobile app.
 * @param navigation - The `navigation` parameter is an object that contains methods and properties
 * related to navigation in React Native. It is typically provided by the React Navigation library and
 * is used to navigate between screens in an app.
 * @returns The code is returning an object with the following properties and values:
 **/
const useSoundSelect = (navigation, {params}) => {
  const {key} = params;
  const {getState, dispatch} = useReduxStore();
  const {ringtones} = getState('Content');
  const [play, setPlay] = useState(false);

  const IOSPlatform = Boolean(Platform.OS == 'ios');
  const checkBG = Boolean(getValue('background') == 'true');

  /** The `initiliazePlayer` function is a callback function that is used to initialize the audio
  player. It takes two parameters: `isStop` and `data`. **/
  const initiliazePlayer = useCallback(async (isStop, data) => {
    try {
      console.log('checkBGcheckBGcheckBGcheckBGcheckBG', checkBG);

      await TrackPlayer.add(data);
      await TrackPlayer.setRepeatMode(RepeatMode.Off);
      await TrackPlayer.updateOptions({
        stopWithApp: true,
        capabilities: [Capability.Play, Capability.Pause, Capability.Stop],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.Stop,
        ],
      });
      TrackPlayer.play();
      setPlay(true);
    } catch (error) {
      console.log('dsnjksvdsnkvbdsjkbsvbdsbvds', error);
    }
  });
  const [active, setActive] = useState(true);
  const [marked, setMarked] = useState(params?.[key]);
  const backFunction = () => {
    navigation.navigate('Settings', {
      ...params,
      [key]: marked || params?.[key],
    });
    return true;
  };

  const toggle = () => setActive(prev => !prev);

  /**
   * The function `setMarkedHandler` updates the marked value, stops playing the audio, resets the
   * TrackPlayer, removes the current track if it exists, and initializes the player again if the
   * platform is iOS and the audio is not playing in the background.
   **/
  const setMarkedHandler = async param => {
    if (active) {
      setMarked(param);
      // TrackPlayer.destroy();
      setPlay(false);
      if (checkBG) {
        await TrackPlayer.reset();
        // const num = await TrackPlayer.getCurrentTrack();
        // Platform.OS == 'android' && (await TrackPlayer.remove(num));
      }

      // if (IOSPlatform && !checkBG) {
      //   await TrackPlayer.setupPlayer();
      // }
      await initiliazePlayer(play, param);
    }
  };
  const onRefresh = () => dispatch(getAllRingtones());

  /** The code block is a function that is being returned by the `useSoundSelect` hook. **/
  useEffect(() => {
    onRefresh();
    // TrackPlayer.destroy();
    // if (checkBG && IOSPlatform) musicSwitch(false);
    // else if (!IOSPlatform) musicSwitch(false);
    // if (checkBG && IOSPlatform) dispatch(playMusic({appMusic: false}));
    // else if (!IOSPlatform) dispatch(playMusic({appMusic: false}));
    return async () => {
      const val = await AsyncStorage.getItem('background');
      await TrackPlayer.reset();
      // const num = await TrackPlayer.getCurrentTrack();
      // IOSPlatform && !checkBG && (await TrackPlayer.reset());
      // IOSPlatform && !checkBG && (await TrackPlayer.destroy());
      // Platform.OS == 'android' && (await TrackPlayer.remove(num));
      if (checkBG) musicSwitch(val);
      // dispatch(playMusic({appMusic: getValue('background') == 'true'}));
    };
  }, []);

  /** The `useEffect` hook is used to add event listeners for the 'gestureEnd' and 'hardwareBackPress'
  events. **/
  useEffect(() => {
    const gestureEnd = navigation.addListener('gestureEnd', e =>
      backFunction(),
    );

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backFunction,
    );

    return () => {
      backHandler.remove();
      gestureEnd();
    };
  }, [marked]);

  return {
    data: params,
    marked,
    setMarked: setMarkedHandler,
    backFunction,
    active,
    toggle,
    ringTone: ringtones,
    onRefresh,
  };
};

export default useSoundSelect;
