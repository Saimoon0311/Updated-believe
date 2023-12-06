import {useEffect} from 'react';
import {favoriteData} from '../../store/actions/content-action';
import useReduxStore from '../../hooks/useReduxStore';
import {toggleFavorite} from '../../store/actions/content-action';
import TrackPlayer from 'react-native-track-player';
import {musicSwitch} from '../../utils/helper';

/**
 * The `useFavorites` function is a custom hook that returns data and functions related to managing
 * favorites, including playing audio, removing favorites, and refreshing the favorites list.
 * @param navigation - The `navigation` parameter is an object that contains methods and properties
 * related to navigation in the app. It is typically provided by a navigation library like React
 * Navigation.
 * @returns The hook is returning an object with the following properties:
 **/
const useFavorites = (navigation, {params}) => {
  /** A custom hook that returns the state and dispatch from the redux store. **/
  const {getState, dispatch} = useReduxStore();
  /** Destructuring the allFavorites from the Content state. **/
  const {allFavorites} = getState('Content');
  /** Destructuring the params object. **/
  const data = params;

  /**
   * It navigates to the MusicPlayer screen and passes the params object as well as the fav boolean
   **/
  const playAudio = async params => {
    await musicSwitch(false);
    navigation.navigate('MusicPlayer', params);
  };

  /**
   * It removes the favorite from the list.
   **/
  const onRemove = toggleData => {
    dispatch(
      toggleFavorite({type: toggleData?.type, audio_id: toggleData?.id}),
    );
  };

  /**
   * It's a function that takes in a dispatch function as an argument and returns a function that
   * dispatches the favoriteData action
   **/
  const onRefresh = () => dispatch(favoriteData());

  /** It's a function that takes in a dispatch function as an argument and returns a function that
 dispatches the favoriteData action **/
  useEffect(() => {
    const event = navigation.addListener('focus', () => onRefresh());
    return event;
  }, [allFavorites]);

  /** It's returning the data, allFavorites, onRefresh, playAudio, onRemove variables. **/
  return {data, allFavorites, onRefresh, playAudio, onRemove};
};

export default useFavorites;
