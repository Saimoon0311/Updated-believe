import {useEffect} from 'react';
import useReduxStore from '../../hooks/useReduxStore';
import useFormHook from '../../hooks/useForm';
import {updatePassword} from '../../store/actions/auth-action';
import Schemas from '../../utils/Validation';

/**
 * The function `UseNewPassword` is a React component that handles the logic for updating a user's
 * password and includes event listeners for navigation and updates.
 * @returns The code is returning an object with the following properties: `errors`, `control`,
 * `handleSubmit`, `goBack`, and `onSubmit`.
 **/
const UseNewPassword = ({navigation, route}) => {
  const goBack = () => navigation.goBack();
  const {handleSubmit, errors, reset, control} = useFormHook(
    Schemas.newPassword,
  );
  const {getState, dispatch} = useReduxStore();
  const {update, verifyToken: reset_token} = getState('Auth');
  /**
   * The onSubmit function dispatches an action to update the password with the provided new password
   * and confirmation password, along with other necessary parameters.
   **/
  const onSubmit = ({confirm_password, new_password}) => {
    dispatch(
      updatePassword({
        reset_token,
        new_password,
        ...route.params,
        confirm_password,
      }),
    );
  };

  /** The code `() => { const event = navigation.addListener('focus', () => reset('', {keepValues:
  false}), ); return event; }` is creating an event listener that listens for the 'focus' event on
  the navigation object. When the 'focus' event is triggered, it calls the `reset` function with an
  empty string as the first argument and an options object as the second argument. The options
  object has a property `keepValues` set to `false`. The event listener is then returned. **/
  useEffect(() => {
    const event = navigation.addListener('focus', () =>
      reset('', {keepValues: false}),
    );
    return event;
  }, []);

  /** The code `() => { if (update) navigation.replace('Update'); }` is an arrow function that is used
  as the callback function for the second useEffect hook. **/
  useEffect(() => {
    if (update) navigation.replace('Update');
  }, [update]);

  return {errors, control, handleSubmit, goBack, onSubmit};
};

export default UseNewPassword;
