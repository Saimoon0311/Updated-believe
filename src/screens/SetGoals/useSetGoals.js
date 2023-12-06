import {useEffect, useState} from 'react';
import useReduxStore from '../../hooks/useReduxStore';
import {getGoals} from '../../store/actions/onboard-action';
import {Alert} from 'react-native';

/**
 * The `useSetGoals` function is a custom hook that handles the logic for selecting and managing goals
 * in a goal-setting feature, including navigating to the next screen and refreshing the goals data.
 * @param navigation - The `navigation` parameter is an object that contains methods and properties
 * related to navigation in React Native. It is typically used to navigate between screens in an app.
 * @returns The function `useSetGoals` returns an object with the following properties:
 **/
const useSetGoals = (navigation, {params}) => {
  const {getState, dispatch} = useReduxStore();
  const {goalData} = getState('OnBoard');

  const [data, setData] = useState(goalData);
  const [goals, setGoals] = useState([]);
  const [goalsName, setGoalsNames] = useState([]);
  /**
   * The GoNext function checks if there are any goals selected and navigates to the 'SetFeeling'
   * screen if there are, otherwise it displays an alert message.
   **/
  const GoNext = () => {
    if (goals.length) navigation.navigate('SetFeeling', {goals, goalsName});
    else Alert.alert('Select minimun one goal');
  };

  /**
   * The function `onRefresh` dispatches a `getGoals` action.
   **/
  const onRefresh = () => {
    dispatch(getGoals());
  };
  /**
   * The function `selectGoals` allows the user to add or remove goals from a list, with a maximum
   * limit of three goals.
   **/
  const selectGoals = item => {
    const newGoals = [...goals];
    const newGoalsName = [...goalsName];
    const index = newGoals.indexOf(item?.id);
    if (index > -1) {
      newGoals.splice(index, 1);
      newGoalsName.splice(index, 1);
    } else {
      if (newGoals.length <= 2) {
        newGoals.push(item?.id);
        newGoalsName.push(item.name);
      } else Alert.alert('Maximum goals limit is three');
    }
    setGoals(newGoals);
    setGoalsNames(newGoalsName);
  };
  /**
   * The function `setFun` returns the value of the variable `goalData`.
   * @returns The variable `data` is being returned.
   **/
  const setFun = () => {
    var data = goalData;
    return data;
  };

  useEffect(() => {
    onRefresh();
    const event = navigation.addListener('focus', () => {
      console.log('First`', goalData);
      setData(goalData);
      console.log('second`');
    });
    return event;
    // const event = navigation.isFocused('focus', onRefresh);
    /** `onRefresh()` is a function that dispatches the `getGoals()` action to fetch the user's goals
    data from the Redux store. It is called in the `useEffect` hook to ensure that the goals data is
    up-to-date when the component mounts or updates. **/
    // return event;
  }, []);

  return {
    goals,
    // goalData,
    goalData: goalData.length > 0 ? setFun() : goalData,
    GoNext,
    onRefresh,
    selectGoals,
  };
};

export default useSetGoals;
