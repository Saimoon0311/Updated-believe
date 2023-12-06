import API from '../../services/API';
import cache from '../../utils/helper/cache';
import {useEffect, useState} from 'react';

/**A constant that is used to set the initial state of the component. **/
const initialState = {all_badges: [], last_unlocked: {}};

/**
 * The function `useBadges` is a custom hook in JavaScript that manages the state of badges data,
 * retrieves badges from an API, and provides a function to navigate to a screen.
 * @param navigation - The navigation parameter is an object that contains methods and properties
 * related to navigation in a React Native application. It is typically provided by a navigation
 * library, such as React Navigation, and is used to navigate between screens or perform other
 * navigation-related actions.
 * @returns The function `useBadges` returns an object with three properties: `state`, `getBadges`, and
 * `navigateScreen`.
 **/
const useBadges = (navigation, {params}) => {
  /**Getting the data from the cache. **/
  const data = cache.get('/get-all-achievements');
  /**A hook that is used to manage the state of the component. **/
  const [state, setState] = useState(data || initialState);

  /**
   * It makes a request to the API to get all the achievements and then sets the state with the data
   **/
  const getBadges = async () => {
    try {
      const {ok, data} = await API.get('/get-all-achievements');
      if (ok) setState(data);
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const navigateScreen = item => {
    console.log('item', item);
    navigation.navigate('Congratulations', item);
  };

  /**A hook that is used to run a function when the component is mounted. **/
  useEffect(() => {
    getBadges();
  }, []);

  /**Returning the state and the function that is used to get the badges. **/
  return {state, getBadges, navigateScreen};
};

export default useBadges;
