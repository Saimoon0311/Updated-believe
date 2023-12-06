import {useEffect, useState} from 'react';
import API from '../../services/API';
import TrackPlayer from 'react-native-track-player';
import {musicSwitch} from '../../utils/helper';

/**
 * The function `useLibraryDetails` is a custom hook that manages state and provides functions for
 * navigating to a music player screen, fetching audios from an API, and refreshing the audios when the
 * component is mounted.
 * @param navigation - The `navigation` parameter is an object that contains methods and properties
 * related to navigation in a React Native application. It is typically provided by the React
 * Navigation library and allows you to navigate between screens, pass parameters, and perform other
 * navigation-related tasks.
 * @returns The function `useLibraryDetails` returns an object with the following properties:
 **/
const useLibraryDetails = (navigation, {params}) => {
  /** `const [audios, setAudios] = useState([]);` is declaring a state variable called `audios` and a
  function to update its value called `setAudios`. The initial value of `audios` is an empty array
  `[]`. This is a common pattern in React to manage state within functional components. **/
  const [audios, setAudios] = useState([]);
  /**
   * The function `libraryDetail` navigates to the 'MusicPlayer' screen with the given parameters.
   **/
  const libraryDetail = async params => {
    await musicSwitch(false);
    navigation.navigate('MusicPlayer', params);
  };
  /**
   * The function `onRefresh` makes an API request to fetch audios based on certain parameters and
   * updates the state with the fetched audios if the request is successful.
   **/
  const onRefresh = async _ => {
    try {
      const {data, ok} = await API.get(
        `/${params?.requestParam}=${params?.id}`,
      );
      if (ok) {
        const {audios} = data || {};
        setAudios(audios);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /** The code `() => { const event = navigation.addListener('focus', onRefresh); return event; }` is
  defining a callback function that is executed when the component is mounted. **/
  useEffect(() => {
    const event = navigation.addListener('focus', onRefresh);
    return event;
  }, []);

  return {data: params, allLibAudios: audios, libraryDetail, onRefresh};
};

export default useLibraryDetails;
