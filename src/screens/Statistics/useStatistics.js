import API from '../../services/API';
import {shareStats} from '../../services/ShareStats';
import {useState, useEffect, useRef} from 'react';

/** Setting the initial state of the component. **/
const initialState = {
  last_unlocked: {},
  longest_streak: '',
  total_minutes: '',
  total_sessions: '',
  record_streaks: [],
};

/**
 * The `useStatistics` function is a custom hook in JavaScript that manages the state and functionality
 * related to user statistics, including making requests to the server, setting the state with the
 * returned data, and providing a reference to a viewShot element for sharing the statistics.
 * @param navigation - The `navigation` parameter is an object that contains information about the
 * navigation state of the component. It is typically provided by a navigation library like React
 * Navigation. It allows you to navigate between different screens or components in your application.
 * @param route - The `route` parameter is an object that contains information about the current route
 * in the navigation stack. It typically includes properties like `key`, `name`, `params`, etc. These
 * properties can be used to access and pass data between different screens in the navigation stack.
 * @returns an object with the following properties:
 **/
const useStatistics = (navigation, route) => {
  /** Setting the initial state of the component. **/
  const [state, setState] = useState(initialState);
  /** Creating a reference to the viewShotRef. **/
  const viewShotRef = useRef();

  /**
   * It makes a request to the server to get the user's stats, and if the request is successful, it sets
   * the state to the data returned from the server
   **/
  const getStats = async params => {
    try {
      console.log('sdsdfdsfd', params);
      const url = params.dateString
        ? `/user-stats?date=${params.dateString}`
        : '/user-stats';
      const {ok, data} = await API.get(url);
      console.log('/user-stats', data);
      if (ok) setState(data);
      // if (ok) setState(data);
    } catch (error) {
      console.log('error', error);
    }
  };

  /** Calling the getStats function when the component is mounted. **/
  useEffect(() => {
    const event = navigation.addListener('focus', getStats);
    return event;
  }, []);

  /** Returning an object with the state, getStats, viewShotRef, and onShareStats. **/
  return {
    state,
    getStats,
    viewShotRef,
    onShareStats: () => shareStats(viewShotRef),
  };
};

export default useStatistics;
