import {useEffect, useState} from 'react';
import useReduxStore from '../../hooks/useReduxStore';
import {getFeelings} from '../../store/actions/onboard-action';
import {Alert} from 'react-native';

/**
 * The `useSetFeeling` function is a custom hook that handles the logic for selecting and deselecting
 * feelings from a list, with a maximum limit of three, and navigating to the next screen if at least
 * one feeling is selected.
 * @param navigation - The `navigation` parameter is an object that contains methods and properties
 * related to navigation in a React Native app. It is typically provided by a navigation library like
 * React Navigation. It allows you to navigate between screens, pass data between screens, and perform
 * other navigation-related tasks.
 * @returns The function `useSetFeeling` returns an object with the following properties:
 **/
const useSetFeeling = (navigation, {params}) => {
  const data = params;
  const {getState, dispatch} = useReduxStore();
  const {feelingData} = getState('OnBoard');
  const [feeling, setFeeling] = useState([]);
  const [names, setNames] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);

  const onRefresh = () => dispatch(getFeelings());

  /**
   * The function `goNext` checks if the `feeling` array has any elements, and if so, it navigates to
   * the 'SetGender' screen with the provided data, otherwise it displays an alert message.
   **/
  const goNext = () => {
    if (feeling.length)
      navigation.navigate('SetGender', {...data, feeling, names});
    else Alert.alert('Select minimun one feeling');
  };

  const selectFeelings = item => {
    const newFeeling = [...feeling];
    const newNames = [...names];
    const index = newFeeling.indexOf(item?.id);
    if (index > -1) {
      newFeeling.splice(index, 1);
      newNames.splice(index, 1);
    } else {
      if (feeling.length <= 2) {
        newFeeling.push(item?.id);
        newNames.push(item.name);
      } else Alert.alert('Maximum feelings limit is three');
    }
    setFeeling(newFeeling);
    setNames(newNames);
  };

  /**
   * The function `selectFeelings` allows the user to select or deselect feelings from a list, with a
   * maximum limit of three.
   **/
  /** The code `() => { onRefresh(); }` is a callback function that is being passed as the first
  argument to the `useEffect` hook. This function is executed after the component is rendered and it
  is responsible for calling the `onRefresh` function. **/
  useEffect(() => {
    onRefresh();
    // const event = navigation.addListener('focus', () => onRefresh());
    // return event;
  }, []);

  return {
    feeling,
    feelingData,
    onRefresh,
    goNext,
    selectFeelings,
  };
};

export default useSetFeeling;
