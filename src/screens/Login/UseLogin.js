import useReduxStore from '../../hooks/useReduxStore';
import {loginUser} from '../../store/actions/auth-action';
import {useEffect} from 'react';
import useFormHook from '../../hooks/useForm';
import Schemas from '../../utils/Validation';

/**
 * The UseLogin function is a custom hook that handles the login functionality, including form
 * validation, dispatching actions, and navigating to different screens.
 * @returns The code is returning an object with the following properties and values:
 **/
const UseLogin = ({navigation}) => {
  /** `const {dispatch} = useReduxStore();` is using the `useReduxStore` hook to access the `dispatch`
  function from the Redux store. The `dispatch` function is used to dispatch actions to the Redux
  store, triggering state updates. **/
  const {dispatch} = useReduxStore();
  /** The line `const {handleSubmit, errors, reset, control} = useFormHook(Schemas.logIn);` is using the
  `useFormHook` custom hook to initialize and destructure the `handleSubmit`, `errors`, `reset`, and
  `control` variables. **/
  const {handleSubmit, errors, reset, control} = useFormHook(Schemas.logIn);

  /**
   * The onSubmit function logs the login data and dispatches a loginUser action.
   **/
  const onSubmit = data => {
    console.log('Login With', data);
    dispatch(loginUser(data));
  };

  /** The code `() => { const event = navigation.addListener('focus', () => reset('', {keepValues:
  false}), ); return event; }` is defining an anonymous arrow function that is used as the callback
  function for the `useEffect` hook. **/
  useEffect(() => {
    const event = navigation.addListener('focus', () =>
      reset('', {keepValues: false}),
    );
    return event;
  }, []);

  /**
   * The `navForget` function navigates to the 'Forget' screen.
   **/
  const navForget = () => navigation.navigate('Forget');
  /**
   * The `navRegister` function navigates to the 'SetGoals' screen in the 'OnboardStack'.
   **/
  const navRegister = () =>
    navigation.navigate('OnboardStack', {screen: 'SetGoals'});
  // const navRegister = () => navigation.navigate('Register');

  return {errors, control, handleSubmit, navForget, navRegister, onSubmit};
};

export default UseLogin;
