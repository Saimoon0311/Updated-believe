import AsyncStorage from '@react-native-async-storage/async-storage';
import useReduxStore from '../../hooks/useReduxStore';
import {
  getTimerTokem,
  setTimerToken,
  hasKey,
  storeValue,
  getValue,
} from '../../services/storage';
import {getAllRingtones} from '../../store/actions/content-action';
import sagaTypes from '../../store/saga-types';
import {bellsData, backgroundData} from '../../utils/helper/LocalDb';
import {useEffect, useLayoutEffect, useState} from 'react';
import {musicSwitch} from '../../utils/helper';

const timer = [
  {
    id: 1,
    name: 'Meditation',
    title: 'Select',
    time: true,
  },
  {
    id: 2,
    name: 'Warp Up',
    title: 'Select',
    time: true,
  },
  {
    id: 3,
    name: 'Intervals',
    title: 'Select',
    time: true,
  },
];

const tracksData = [
  {
    id: 1,
    disabled: false,
    name: 'Starting Bell',
    artist: 'Victoria Gallagher',
    title: 'Select',
    url: '',
    artwork: '',
  },
  {
    id: 2,
    disabled: false,
    name: 'Ending Bell',
    artist: 'Victoria Gallagher',
    title: 'Select',
    url: '',
    artwork: '',
  },
  {
    id: 3,
    disabled: false,
    name: 'Intervals Bell',
    artist: 'Victoria Gallagher',
    title: 'Select',
    url: '',
    artwork: '',
  },
];

/**
 * The `useSettings` function is a custom hook that handles the logic for setting up and managing
 * session data for a meditation app, including saving and retrieving data from local storage,
 * navigating to different screens, and dispatching actions.
 * @returns The function `useSettings` returns an object with the following properties:
 **/
const useSettings = ({navigate}, {params}) => {
  const hasTimer = hasKey('timer');
  const saveTimerVal = hasTimer && getTimerTokem('timer');
  const {getState, dispatch} = useReduxStore();
  const sessionData = getState('sessionReducer');
  const {ringtones} = getState('Content');
  console.log('saveTimerVal', saveTimerVal);
  const data = hasTimer && !params?.meditation ? saveTimerVal : params;
  const asyncDate = AsyncStorage.getItem('sessionData');
  const storeDate = getValue('sessionData');
  const [dummy, setDummy] = useState({
    meditation: '',
    startBell: null,
    endBell: null,
    background: backgroundData,
  });
  useEffect(() => {
    console.log('hasTimerhasTimerhasTimerhasTimerhasTimer', sessionData);
    // console.log('dummy state ', dummy, data);
    // console.log(
    //   'dataadtaataatafatattatatatat',
    //   data.meditation,
    //   dummy.meditation,
    //   storeDate.meditation,
    //   sessionData.meditation,
    // );
  }, [params]);
  useLayoutEffect(() => {
    (async () => {
      const asyncDate = await AsyncStorage.getItem('sessionDatas');
      console.log('async storage data', asyncDate);
      // dispatch({
      //   type: sagaTypes.updateSessionData,
      //   payload: asyncDate,
      // });
      console.log('async storage data', asyncDate.meditation);
      setDummy(asyncDate);
    })();
  }, [params]);
  // console.log(
  //   'storeDatestoreDatestoreDatestoreDatestoreDatestoreDatestoreDate',
  //   asyncDate,
  // );

  /** The `meditateData` object is being created with default values for the meditation session. It
  checks if the `data` object has any values for `meditation`, `startBell`, `endBell`, and
  `background`. If it does, it uses those values. Otherwise, it checks if there are any values in
  the `sessionData` object for those properties. If there are, it uses those values. If none of
  those values are available, it uses default values (`300` for `meditation`, the first item in the
  `ringtones` array for `startBell`, the second item in the `ringtones` array for `endBell`, and the
  `backgroundData` object for `background`). **/
  const meditateData = {
    meditation:
      data?.meditation ||
      dummy?.meditation ||
      storeDate?.meditation ||
      sessionData?.meditation ||
      300,
    startBell:
      data?.startBell ||
      dummy?.startBell ||
      storeDate?.startBell ||
      sessionData?.startBell ||
      ringtones[0],
    endBell:
      data?.endBell ||
      dummy?.endBell ||
      storeDate?.endBell ||
      sessionData?.endBell ||
      ringtones[1],
    background:
      data?.background ||
      dummy?.background ||
      storeDate?.background ||
      sessionData?.background ||
      backgroundData,
  };

  /**
   * The function `saveData` updates the session data and stores it in local storage.
   **/
  const saveData = async data => {
    if (data) {
      console.log('sdsdsdsd', data);
      await AsyncStorage.setItem('sessionDatas', JSON.stringify(data));
      storeValue('sessionData', JSON.stringify(data));
      dispatch({
        type: sagaTypes.updateSessionData,
        payload: data,
      });
    } else {
      await AsyncStorage.setItem('sessionDatas', JSON.stringify(meditateData));
      storeValue('sessionData', JSON.stringify(meditateData));
      dispatch({
        type: sagaTypes.updateSessionData,
        payload: meditateData,
      });
    }
  };
  // const dataasa =
  //   hasTimer && !params?.meditation
  //     ? saveTimerVal
  //     : saveData({...meditateData, params});
  /**
   * The function `onSessionStart` navigates to the 'SessionTimer' page with the `meditateData` and
   * saves the data.
   **/
  const onSessionStart = async () => {
    saveData();
    await musicSwitch(false);
    navigate('SessionTimer', meditateData);
  };
  /**
   * The function `onBackgroundSelect` navigates to the 'BackgroundSelect' page with the `meditateData`
   * as a parameter.
   **/
  const onBackgroundSelect = () => navigate('BackgroundSelect', meditateData);

  /**
   * The function `daynamicRoute` navigates to a specified route with additional data passed as
   * parameters.
   * @param route - The `route` parameter is the destination route that you want to navigate to. It is
   * typically a string that represents the path or URL of the route.
   * @param key - The `key` parameter is a unique identifier for the route. It is typically used by
   * React to efficiently update and render components\.
   * @param header - The `header` parameter is a variable that represents the header information that
   * you want to pass to the `navigate` function. It could be an object containing key-value pairs of
   * header information such as authorization tokens, content type, etc.
   **/
  const daynamicRoute = (route, key, header) => {
    navigate(route, {...meditateData, key, header});
  };

  /**
   * The function onReFresh dispatches a getAllRingtones action.
   **/
  const onReFresh = () => dispatch(getAllRingtones());
  useEffect(() => {
    onReFresh();
    if (params) {
      setTimerToken('timer', params);
      saveData({...meditateData, params});
    }
  }, [params]);

  return {
    data,
    timer,
    tracksData,
    meditateData,
    backgroundData,
    daynamicRoute,
    onSessionStart,
    onBackgroundSelect,
  };
};

export default useSettings;
