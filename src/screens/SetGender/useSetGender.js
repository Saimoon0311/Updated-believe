import {useEffect, useState} from 'react';
import useReduxStore from '../../hooks/useReduxStore';
import {getTracks} from '../../store/actions/onboard-action';

/**
 * The `useSetGender` function is a custom hook that handles the logic for setting and updating the
 * gender state, as well as navigating to the next screen with the selected gender.
 * @param navigation - The `navigation` parameter is an object that contains methods for navigating
 * between screens in a React Native application. It is typically provided by the React Navigation
 * library and allows you to navigate to different screens by calling its methods, such as `navigate`,
 * `goBack`, etc.
 * @returns The function `useSetGender` returns an object with the following properties:
 **/
const useSetGender = (navigation, {params}) => {
  const data = params;
  const {getState, dispatch} = useReduxStore();
  const {genderData} = getState('OnBoard');

  /**
   * The function `onRefresh` dispatches the `getTracks` action.
   **/
  const onRefresh = () => dispatch(getTracks());

  /** The line `const [gender, setGender] = useState('');` is using the `useState` hook from React to
  create a state variable called `gender` and a corresponding setter function called `setGender`.
  The initial value of the `gender` state is set to an empty string (`''`). This allows you to store
  and update the selected gender value in the component's state. **/
  const [gender, setGender] = useState('');

  /**
   * The GoNext function navigates to the 'SetAge' screen with the provided data and gender.
   **/
  const GoNext = () => navigation.navigate('SetAge', {...data, gender});

  /**
   * The GoSkip function navigates to the 'SetAge' screen with the provided data and gender.
   **/
  const GoSkip = () => {
    navigation.navigate('SetAge', {...data, gender});
  };
  useEffect(() => {
    onRefresh();
  }, []);

  return {
    gender,
    genderData,
    setGender,
    GoNext,
    onRefresh,
    GoSkip,
  };
};

export default useSetGender;
