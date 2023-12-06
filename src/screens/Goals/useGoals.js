import API from '../../services/API';
import {showSuccess} from '../../services/SnackBar';
import {useState, useEffect} from 'react';
import {Alert} from 'react-native';

/**
 * The `useGoals` function is a custom hook in JavaScript that manages the state and functionality
 * related to user goals, including fetching goals from an API, selecting goals, updating goals, and
 * refreshing the page.
 * @param navigation - The `navigation` parameter is an object that represents the navigation state and
 * functions provided by a navigation library, such as React Navigation. It is used to navigate between
 * screens or perform other navigation-related actions.
 * @returns The function `useGoals` returns an object with the following properties:
 **/
const useGoals = (navigation, {params}) => {
  const [goals, setGoals] = useState([]);
  const [selected, setSelected] = useState([]);

  /**
   * It takes the goals that are included and sends them to the server
   **/
  const updateAndBack = async () => {
    try {
      if (!selected.length) return Alert.alert('Please select atleast one');
      const {ok, data} = await API.post(params?.post, {ids: selected});
      // const {ok, data} = await API.post('/update-goals', {ids});
      if (ok) {
        showSuccess(data?.message);
        navigation.goBack('');
      }
    } catch (error) {}
  };
  /**
   * It fetches the user's goals from the API.
   **/
  const getuserGoals = async () => {
    try {
      const {ok, data} = await API.get(params?.get);
      if (ok) {
        const response = data?.goals || data?.feelings || [];
        setGoals(response);
        setSelected(response.filter(x => x?.is_included).map(item => item.id));
      }
    } catch (error) {
      console.log('getuserGoals error', error);
    }
  };
  /**
   * It takes a selected goal and returns a new array of goals with the selected goal's is_included
   * property set to true if it was false and false if it was true
   **/
  const selectGoals = selectedGoal => {
    if (selected.includes(selectedGoal?.id))
      setSelected(prevSatate =>
        prevSatate?.filter(id => selectedGoal?.id !== id),
      );
    else if (selected.length > 2) return Alert.alert('Maximum limit is three');
    else setSelected(prevSatate => [...prevSatate, selectedGoal?.id]);
  };

  /**
   * It refreshes the page.
   **/
  const onRefresh = () => getuserGoals();

  /* A react hook that is called when the component is mounted. **/
  useEffect(() => {
    onRefresh();
  }, []);

  /** Returning the functions and the state. **/
  return {
    goBack: updateAndBack,
    onRefresh,
    selectGoals,
    goals,
    selected,
  };
};

export default useGoals;
