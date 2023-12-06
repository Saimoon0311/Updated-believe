import {useEffect} from 'react';
import useReduxStore from '../../hooks/useReduxStore';
import {signUpUser} from '../../store/actions/auth-action';
import useFormHook from '../../hooks/useForm';
import Schemas from '../../utils/Validation';

/**
 * The UseRegister function is a custom hook that handles the registration process, including form
 * validation, submission, and navigation.
 * @param navigation - The `navigation` parameter is an object that is used for navigating between
 * screens in a React Native application. It typically includes methods like `navigate`, `goBack`, and
 * `addListener` to handle navigation actions.
 * @returns The function `UseRegister` is returning an object with the following properties:
 **/
const UseRegister = (navigation, {params}) => {
  const navLogin = () => navigation.navigate('Login');
  const {dispatch, getState} = useReduxStore();
  const {isRegister} = getState('Auth');
  /** The line `const {handleSubmit, errors, reset, control} = useFormHook(Schemas.signUp);` is using
  object destructuring to assign the values returned by the `useFormHook` function to the variables
  `handleSubmit`, `errors`, `reset`, and `control`. **/
  const {handleSubmit, errors, reset, control} = useFormHook(Schemas.signUp);
  /**
   * The onSubmit function dispatches a signUpUser action with the merged data and params.
   **/
  const onSubmit = data => {
    dispatch(signUpUser({...data, params}));
  };

  /** The code `() => { ... }` is defining an anonymous function. This function is being used as the
  callback function for the `useEffect` hook. **/
  useEffect(() => {
    const event = navigation.addListener('focus', () =>
      reset('', {keepValues: false}),
    );
    return event;
  }, []);

  /** The code `() => { if (isRegister) navLogin(); }` is defining an anonymous function that is being
  used as the callback function for the `useEffect` hook. **/
  useEffect(() => {
    if (isRegister) navLogin();
  }, [isRegister]);

  return {errors, control, handleSubmit, onSubmit, navLogin};
};

export default UseRegister;
