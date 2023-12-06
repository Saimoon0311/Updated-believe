import {useEffect} from 'react';
import useReduxStore from '../../hooks/useReduxStore';
import {getAllCourses} from '../../store/actions/content-action';

/**
 * The `useCourses` function is a custom hook that retrieves the state and dispatch function from the
 * Redux store, and provides functions and data related to courses, including navigation and
 * refreshing.
 * @returns The function `useCourses` returns an object with the following properties:
 **/
const useCourses = ({navigate, addListener}, {params}) => {
  /** The code is using the `useReduxStore` hook to access the Redux store and retrieve the state and
dispatch function. **/
  const {getState, dispatch} = useReduxStore();
  const {allCourses} = getState('Content');
  const {user} = getState('Auth');

  /**
   * The function "courseDetail" is used to navigate to the "CourseDetail" page with the given
   * parameters.
   **/
  const courseDetail = params => navigate('CourseDetail', params);

  /**
   * The function "onRefresh" dispatches an action to get all courses.
   **/
  const onRefresh = () => dispatch(getAllCourses());

  /** The code `() => { const event = addListener('focus', onRefresh); return event; }` is defining an
  anonymous function that is used as the effect cleanup function in the `useEffect` hook. **/
  useEffect(() => {
    const event = addListener('focus', onRefresh);
    return event;
  }, []);

  return {data: params, allCourses, courseDetail, onRefresh, user};
};

export default useCourses;
