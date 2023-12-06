import useFormHook from '../../hooks/useForm';
import Schemas from '../../utils/Validation';

/**
 * The `useIntroduction` function initializes and returns variables and functions related to form
 * handling and navigation.
 * @returns The function `useIntroduction` is returning an object with the properties `errors`,
 * `control`, `onSubmit`, and `handleSubmit`.
 **/
const useIntroduction = ({navigation}) => {
  /** The line `const {handleSubmit, errors, control} = useFormHook(Schemas.username);` is using the
  `useFormHook` custom hook to initialize and destructure the `handleSubmit`, `errors`, and
  `control` variables. **/
  const {handleSubmit, errors, control} = useFormHook(Schemas.username);

  /**
   * The onSubmit function navigates to the 'SetGoals' screen with the dataForm as a parameter.
   **/
  const onSubmit = dataForm => {
    navigation.navigate('SetGoals', dataForm);
  };

  return {errors, control, onSubmit, handleSubmit};
};

export default useIntroduction;
