import API from '../../services/API';
import {showError} from '../../services/SnackBar';
import {useEffect, useState} from 'react';

/**
 * The `useNotifications` function is a custom hook in JavaScript that retrieves user notifications
 * from an API and updates the data when the component is mounted.
 * @returns The function `useNotifications` returns an object with two properties: `data` and
 * `onRefresh`.
 **/
const useNotifications = ({navigation, route}) => {
  // const data = route.params;
  const [data, setData] = useState([]);

  /**
   * The function `onRefresh` makes an asynchronous API call to retrieve user notifications and updates
   * the data if the call is successful, otherwise it shows an error.
   **/
  const onRefresh = async () => {
    const {ok, data} = await API.get('/user-notifications');
    if (ok) setData(data);
    else showError('err');
  };

  /** The `() => { onRefresh(); }` is an arrow function that is being passed as a callback to the
  `useEffect` hook. It is executed when the component is mounted (i.e., when the component is first
  rendered) because an empty dependency array `[]` is passed as the second argument to `useEffect`. **/
  useEffect(() => {
    onRefresh();
  }, []);

  return {data, onRefresh};
};

export default useNotifications;
