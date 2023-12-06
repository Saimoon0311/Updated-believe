import {useEffect, useState} from 'react';
import useReduxStore from '../../hooks/useReduxStore';
import {getTracks} from '../../store/actions/onboard-action';

/**
 * The useSetAge function is a custom hook that handles age-related data and navigation in a React
 * Native app.
 * @param navigation - The `navigation` parameter is an object that contains methods for navigating
 * between screens in a React Native app. It is typically provided by the React Navigation library.
 * @returns an object with the following properties:
 **/
const useSetAge = (navigation, {params}) => {
  const data = params;

  const {getState, dispatch} = useReduxStore();
  const {ageData} = getState('OnBoard');

  const onRefresh = () => dispatch(getTracks());

  const [age, setAge] = useState({
    name: '',
  });

  /**
   * The GoSkip function navigates to the 'ContentLoading' screen with the provided data and age.
   **/
  const GoSkip = () => {
    navigation.navigate('ContentLoading', {...data, age});
  };

  useEffect(() => {
    onRefresh();
  }, []);

  return {
    age,
    ageData,
    setAge,
    GoNext: GoSkip,
    GoSkip,
    onRefresh,
  };
};

export default useSetAge;
