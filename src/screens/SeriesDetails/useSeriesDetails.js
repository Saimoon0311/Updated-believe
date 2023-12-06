import {useEffect, useState} from 'react';
import useReduxStore from '../../hooks/useReduxStore';
import {
  getAllVideos,
  handleAppStreak,
} from '../../store/actions/content-action';
import TrackPlayer from 'react-native-track-player';
import {musicSwitch} from '../../utils/helper';

/**
 * The `useSeriesDetails` function is a custom hook that provides various functions and data related to
 * a series, such as viewing reviews, navigating to different screens based on the type of video
 * content, hiding/showing a menu, refreshing the video list, and accessing series data and all related
 * videos.
 * @param navigation - The `navigation` parameter is an object that contains methods for navigating
 * between screens in a React Native application. It is typically provided by the React Navigation
 * library.
 * @returns The function `useSeriesDetails` returns an object with the following properties:
 **/
const useSeriesDetails = (navigation, {params}) => {
  const [visible, setVisible] = useState(false);
  const data = params;
  const {getState, dispatch} = useReduxStore();
  const {allCatVideos} = getState('Content');

  /**
   * The function `viewReviews` hides the menu, navigates to the 'Reviews' page, and passes some data and
   * parameters to the page.
   **/
  const viewReviews = () => {
    hideMenu();
    navigation.navigate('Reviews', {
      ...data,
      requestParam: `series-reviews?series_id=${data?.id}`,
      value: 'series_id',
      sendRequest: 'add-series-review',
    });
  };

  /**
   * The function `videoDetail` navigates to different screens based on the type of video content
   * provided in the `params` object.
   **/
  const videoDetail = async params => {
    if (params?.type == 'audio') {
      dispatch(handleAppStreak());
      await musicSwitch(false);
      navigation.navigate('MusicPlayer', {...params, isSeries: true});
    } else navigation.navigate('VideoContent', params);
  };
  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);

  /**
   * The `onRefresh` function dispatches a `getAllVideos` action with an object containing an `id` and
   * `requestParam` as parameters.
   **/
  const onRefresh = _ =>
    dispatch(getAllVideos({id: data?.id, requestParam: params?.requestParam}));

  /** The `() => { onRefresh(); }` is an arrow function that is being passed as a callback function to
  the `useEffect` hook. It is executed when the component is mounted or when the dependencies of the
  `useEffect` hook change. In this case, it is used to call the `onRefresh` function, which
  dispatches the `getAllVideos` action to fetch all the videos related to a series. **/
  useEffect(() => {
    onRefresh();
  }, []);

  return {
    data,
    allCatVideos,
    visible,
    hideMenu,
    showMenu,
    videoDetail,
    onRefresh,
    viewReviews,
  };
};

export default useSeriesDetails;
