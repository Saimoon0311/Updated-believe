import {useEffect} from 'react';
import useReduxStore from '../../hooks/useReduxStore';
import {getAllEBooks} from '../../store/actions/content-action';

/**
 * The `useEBooks` function is a custom hook that retrieves all eBooks from the Redux store, navigates
 * to the eBook detail page, and dispatches an action to refresh the eBooks.
 * @returns The function `useEBooks` is returning an object with the following properties:
 **/
const useEBooks = ({navigate}, {params}) => {
  /** `const {getState, dispatch} = useReduxStore();` is using the `useReduxStore` hook to get the
  `getState` and `dispatch` functions from the Redux store. **/
  const {getState, dispatch} = useReduxStore();
  /** `const {allEBooks} = getState('Content');` is using the `getState` function from the Redux store
  to retrieve the value of the `allEBooks` property from the `Content` state. It is destructuring
  the value of `allEBooks` from the returned state object. **/
  const {allEBooks} = getState('Content');

  /**
   * The function eBookDetail takes in a parameter and navigates to the 'DownloadContent' page with the
   * given parameter.
   **/
  const eBookDetail = params => navigate('DownloadContent', params);

  /**
   * The function `onRefresh` dispatches an action to get all eBooks.
   **/
  const onRefresh = () => dispatch(getAllEBooks());

  /** The `useEffect` hook is used to perform side effects in functional components. In this case, it is
used to call the `onRefresh` function when the component is mounted (i.e., when it is first
rendered). **/
  useEffect(() => {
    onRefresh();
  }, []);

  const data = params;

  return {data, allEBooks, eBookDetail, onRefresh};
};

export default useEBooks;
