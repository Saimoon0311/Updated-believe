import {useEffect} from 'react';
import useReduxStore from '../../hooks/useReduxStore';
import {forgotUser} from '../../store/actions/auth-action';
import useFormHook from '../../hooks/useForm';
import Schemas from '../../utils/Validation';
import API from '../../services/API';
import AuthService from '../../services/auth-service';
import {showError, showInfo, showSuccess} from '../../services/SnackBar';

/**
 * The function `UseForget` is a React hook that handles the logic for a forgot password form,
 * including form validation, submission, and navigation.
 * @returns The code is returning an object that contains the following properties and functions:
 **/
const UseForget = ({navigation}) => {
  /**
   * The above code defines a function called `goBack` that uses the `navigation` object to go back to
   * the previous screen, and also uses the `useReduxStore` hook to get the `dispatch` and `getState`
   * functions from the Redux store, and then gets the `forgot` property from the `Auth` state.
   **/
  const goBack = () => navigation.goBack();
  const {dispatch, getState} = useReduxStore();
  const {forgot} = getState('Auth');

  /* The code is using the `useFormHook` to initialize form-related functions and properties. **/
  const {handleSubmit, errors, reset, control, getValues} = useFormHook(
    Schemas.forgot,
  );

  /**
   * The onSubmit function dispatches a forgotUser action with the provided data.
   **/
  const onSubmit = async datas => {
    // dispatch(forgotUser(data));
    const {ok, data, originalError} = await API.post('/forgot_password', {
      email: datas.email,
    });
    if (ok) {
      showSuccess('Password Reset Request has been sent to your mail');
      navigation.navigate('Login');
    } else {
      showError('Email not found');
    }
    // AuthService.forgot({email: datas.email});
    console.log(
      'jkdjkvbdksbvdsjkvbdsjksdsdsdsvbdjs',
      data.message,
      originalError,
      datas,
    );
  };

  /** The `useEffect` hook is used to perform side effects in functional components. In this case, it is
used to add an event listener to the `navigation` object when the component is mounted. **/
  useEffect(() => {
    const event = navigation.addListener('focus', () =>
      reset('', {keepValues: false}),
    );
    return event;
  }, []);

  /** The `useEffect` hook is used to perform side effects in functional components. In this case, it is
used to check if the `forgot` property from the Redux store has changed. If it has, it means that
the user has successfully submitted the forgot password form and the component needs to navigate to
the "Verification" screen. The `navigation.replace` function is called with the screen name
"Verification" and the values from the form (retrieved using the `getValues` function) as
parameters. This will replace the current screen with the "Verification" screen and pass the form
values as props to the new screen. **/
  useEffect(() => {
    if (forgot) navigation.replace('Verification', getValues());
  }, [forgot]);

  return {errors, control, handleSubmit, goBack, onSubmit};
};

export default UseForget;
