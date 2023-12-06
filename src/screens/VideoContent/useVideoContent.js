import {Platform} from 'react-native';
import useReduxStore from '../../hooks/useReduxStore';
import {getValue} from '../../services/storage';
import {playMusic} from '../../store/actions/music-action';
import {useEffect, useState} from 'react';
import TrackPlayer from 'react-native-track-player';
import {musicSwitch} from '../../utils/helper';

/**
 * The `useVideoContent` function is a custom hook in JavaScript that handles video content, including
 * fullscreen mode and current time tracking, based on the navigation and route parameters.
 * @returns The function `useVideoContent` returns an object with the properties `data`, `fullscreen`,
 * `checkFullScreen`, and `currentTime`.
 **/
const useVideoContent = ({navigation, route}) => {
  const data = route.params;
  const [fullscreen, setFullScreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const {dispatch} = useReduxStore();
  const checkFullScreen = (val, time) => {
    setFullScreen(val);
    setCurrentTime(time);
  };

  /** The line `const checkBG = Boolean(getValue('background') == 'true');` is checking if the value of
  the 'background' key in the storage is equal to the string 'true'. **/
  const checkBG = Boolean(getValue('background') == 'true');

  /**
   * The function `handlePlayer` checks the background status and platform type, and performs different
   * actions accordingly.
   **/
  const handlePlayer = async () => {
    if (checkBG && Platform.OS == 'ios') {
      await TrackPlayer.updateOptions({stopWithApp: true});
      await musicSwitch(false);
    } else if (checkBG && Platform.OS == 'android') {
      await musicSwitch(false);
    }
  };

  /** The `useEffect` hook is used to perform side effects in a functional component. In this case, the
  `useEffect` hook is being used to handle the player based on the background status and platform
  type. **/
  useEffect(() => {
    handlePlayer();
    return async () => {
      if (checkBG) {
        // Platform.OS == 'ios' && (await TrackPlayer.setupPlayer());
        // dispatch(playMusic({appMusic: getValue('background') == 'true'}));
        musicSwitch(getValue('background') == 'true');
      }
    };
  }, []);

  return {data, fullscreen, checkFullScreen, currentTime};
};

export default useVideoContent;
