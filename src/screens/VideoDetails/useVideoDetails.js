import {useEffect} from 'react';
import useReduxStore from '../../hooks/useReduxStore';
import {getAllVideos} from '../../store/actions/content-action';

/**
 * The `useVideoDetails` function is a custom hook that retrieves video details and dispatches actions
 * to get all videos with provided parameters.
 * @param navigation - The `navigation` parameter is an object that contains methods and properties
 * related to navigation in React Navigation. It is typically used to navigate between screens in a
 * mobile app.
 * @returns The function `useVideoDetails` returns an object with the following properties:
 **/
const useVideoDetails = (navigation, {params}) => {
  const {getState, dispatch} = useReduxStore();
  const {allCatVideos} = getState('Content');
  const videoDetail = params => navigation.navigate('VideoContent', params);

  /**
   * The `onRefresh` function dispatches an action to get all videos with the provided parameters.
   **/
  const onRefresh = _ =>
    dispatch(
      getAllVideos({id: params?.id, requestParam: params?.requestParam}),
    );

  useEffect(() => {
    onRefresh();
  }, []);

  return {data: params, allCatVideos, videoDetail, onRefresh};
};

export default useVideoDetails;
