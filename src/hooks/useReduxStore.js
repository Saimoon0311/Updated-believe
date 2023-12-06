import {useSelector, useDispatch} from 'react-redux';

/**
 * The useReduxStore function returns the dispatch and getState functions from the Redux store.
 * @returns The `useReduxStore` function returns an object with two properties: `dispatch` and
 * `getState`.
 */
const useReduxStore = () => {
  const dispatch = useDispatch();
  const getState = key => useSelector(state => state[key]);
  return {dispatch, getState};
};

export default useReduxStore;
