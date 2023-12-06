import {secondsToTime} from '../../utils/helper';
import {useEffect, useRef, useState} from 'react';
import {BackHandler} from 'react-native';

/**
 * The `useSessionSelect` function is a custom hook in JavaScript that handles session selection logic,
 * including updating the duration, checking if the total time exceeds a certain limit, and navigating
 * back to the settings screen.
 * @param navigation - The `navigation` parameter is an object that contains methods and properties
 * related to navigation in React Native. It is typically provided by the React Navigation library and
 * allows you to navigate between screens in your app.
 * @returns The function `useSessionSelect` returns an object with the following properties:
 **/
const useSessionSelect = (navigation, {params}) => {
  const data = params;
  /** The `useState` hook is used to declare a state variable called `duration` and a function to update
it called `setDuration`. The initial value of `duration` is determined by the expression inside
`useState`. **/
  const [duration, setDuration] = useState(
    data[data?.key]
      ? secondsToTime(Number(data[data?.key]))
      : {seconds: 0, minutes: 0, hours: 0},
  );
  console.log('datadhjsbfjsdbfjksdbfjksd', data, duration);
  const {seconds} = duration;
  const minutes = duration.minutes * 60;
  const hours = duration.hours * 3600;
  const durationRef = useRef(duration);
  const totalTime = Number(seconds) + Number(minutes) + Number(hours);

  console.log('data on picler ', data?.meditation, data);

  /** The line `const isGrater = data?.key == 'intervals' && totalTime >= data?.meditation;` is checking
if the value of `data?.key` is equal to 'intervals' and if the `totalTime` is greater than or equal
to the value of `data?.meditation`. **/
  const isGrater = data?.key == 'intervals' && totalTime >= data?.meditation;

  /**
   * The backFunction navigates to the 'Settings' screen and passes a modified version of the params
   * object.
   * @returns `true`.
   **/
  const backFunction = () => {
    navigation.navigate('Settings', {
      ...params,
      [data?.key]: isGrater ? 0 : totalTime,
    });
    return true;
  };
  /** The `useEffect` hook is used to perform side effects in a React component. In this case, the
`useEffect` hook is used to add event listeners for the `gestureEnd` event and the
`hardwareBackPress` event. **/

  useEffect(() => {
    const gestureEnd = navigation.addListener('gestureEnd', backFunction);
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backFunction,
    );
    return () => {
      backHandler.remove();
      gestureEnd();
    };
  }, [duration]);

  return {data, setDuration, backFunction, duration, isGrater, durationRef};
};

export default useSessionSelect;
