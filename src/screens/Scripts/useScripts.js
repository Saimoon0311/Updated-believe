import {useEffect} from 'react';
import useReduxStore from '../../hooks/useReduxStore';
import {getAllScripts} from '../../store/actions/content-action';

/**
 * The `useScripts` function is a custom hook that provides data and functions related to scripts,
 * including navigation and refreshing.
 * @returns The function `useScripts` returns an object with the following properties:
 **/
const useScripts = ({navigate}, {params}) => {
  const {getState, dispatch} = useReduxStore();
  const {allScripts} = getState('Content');

  /**
   * The function "scriptDetail" is used to navigate to the "ScriptDetails" page with the given
   * parameters.
   **/
  const scriptDetail = params => navigate('ScriptDetails', params);

  /**
   * The function `onRefresh` dispatches an action to get all scripts.
   **/
  const onRefresh = () => dispatch(getAllScripts());

  /** The `() => { onRefresh(); }` is an arrow function that is being used as the callback function for
  the `useEffect` hook. **/
  useEffect(() => {
    onRefresh();
  }, []);

  const data = params;

  return {data, allScripts, scriptDetail, onRefresh};
};

export default useScripts;
