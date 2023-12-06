import {useEffect, useState} from 'react';
import useFormHook from '../../hooks/useForm';
import useReduxStore from '../../hooks/useReduxStore';
import {forgotUser, verifyCode} from '../../store/actions/auth-action';
import Schemas from '../../utils/Validation';

/**
 * The `UseVerification` function is a custom hook in JavaScript that handles the verification process,
 * including timer countdown, form submission, code resending, and navigation.
 * @returns an object with the following properties:
 **/
const UseVerification = ({navigation, route}) => {
  const [timer, setTimer] = useState(60);

  /**
   * The getTime function takes a time in seconds and returns it in the format "mm:ss".
   * @returns The function `getTime` returns a string in the format "mm:ss", where "mm" represents the
   * minutes and "ss" represents the seconds.
   **/
  const getTime = t => {
    const digit = n => (n < 10 ? `0${n}` : `${n}`);
    const sec = digit(Math.floor(t % 60));
    const min = digit(Math.floor((t / 60) % 60));
    return min + ':' + sec;
  };

  const {dispatch, getState} = useReduxStore();
  const {verification} = getState('Auth');
  const {handleSubmit, errors, reset, control} = useFormHook(
    Schemas.verification,
  );

  /**
   * The function onSubmit dispatches a verifyCode action with the merged data and route parameters.
   **/
  const onSubmit = data => {
    dispatch(verifyCode({...data, ...route.params}));
  };

  /**
   * The function `resendCode` sets a timer for 120 seconds and dispatches a forgotUser action with the
   * route params.
   **/
  const resendCode = () => {
    setTimer(120);
    dispatch(forgotUser(route.params));
  };

  const {email} = route.params;

  /** The `useEffect` hook is used to perform side effects in a functional component. In this case, the
`useEffect` hook is being used to add an event listener to the `navigation` object. **/
  useEffect(() => {
    const event = navigation.addListener('focus', () =>
      reset('', {keepValues: false}),
    );
    return event;
  }, []);

  /** The `useEffect` hook in the code snippet is used to create a timer that counts down from a specified
time (in this case, 60 seconds) and updates the `timer` state every second. **/
  useEffect(() => {
    let interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          return prevTimer;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  /** The `useEffect` hook in the code snippet is used to monitor changes in the `verification` state.
When the `verification` state changes (i.e., when it is not null or undefined), the
`navigation.replace` function is called to navigate to the 'NewPassword' screen, passing the
`route.params` as the navigation parameters. This effect is triggered whenever the `verification`
state changes. **/
  useEffect(() => {
    if (verification) navigation.replace('NewPassword', route.params);
  }, [verification]);

  return {
    email,
    timer,
    errors,
    control,
    getTime,
    handleSubmit,
    resendCode,
    onSubmit,
  };
};

export default UseVerification;
