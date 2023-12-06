import {useEffect} from 'react';
import useReduxStore from '../../hooks/useReduxStore';
import {getAllSeries} from '../../store/actions/content-action';

/**
 * The useSeries function is a custom hook that provides data, functions, and actions related to series
 * content, including navigation to series details and refreshing the series data.
 * @returns an object with the following properties:
 **/
const useSeries = ({navigation: {navigate}, route}) => {
  const {getState, dispatch} = useReduxStore();
  const {allSeries} = getState('Content');

  /**
   * The function "seriesDetail" is used to navigate to the "SeriesDetails" page with the given
   * parameters.
   */
  const seriesDetail = params => navigate('SeriesDetails', params);

  /**
   * The function "onRefresh" dispatches an action to get all series.
   */
  const onRefresh = () => dispatch(getAllSeries());

  useEffect(() => {
    onRefresh();
  }, []);

  const data = route.params;

  return {data, allSeries, seriesDetail, onRefresh};
};

export default useSeries;
