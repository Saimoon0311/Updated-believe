import {useState} from 'react';
import Schemas from '../../utils/Validation';
import useFormHook from '../../hooks/useForm';
import useReduxStore from '../../hooks/useReduxStore';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {mediaPermission} from '../../hooks/useMediaPermission';
import {updateProfile} from '../../store/actions/auth-action';
import moment from 'moment';

/**
 * The `useEditProfile` function is a custom hook in JavaScript that handles editing a user's profile,
 * including updating their name, gender, age, and profile image.
 * @returns The function `useEditProfile` returns an object with the following properties:
 **/
const useEditProfile = ({navigation, route}) => {
  const data = route.params;
  const {getState, dispatch} = useReduxStore();
  const {handleSubmit, errors, control} = useFormHook(Schemas.editProfile);
  const {user} = getState('Auth');
  const [marked, setMarked] = useState(user?.gender);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(user?.age || 'D.O.B');
  const [image, setImage] = useState('');
  // console.log('image', image);

  /** The code snippet is checking the type of the `date` variable. If the type is a string, it sets the
`stringType` variable to `true`. Then, it assigns the value of `date` to the `selectedDate` variable
if `stringType` is `true`. Otherwise, it formats the `date` using the `moment` library and assigns
the formatted date to the `selectedDate` variable. **/
  const stringType = Boolean(typeof date == 'string');
  const selectedDate = stringType ? date : moment(date).format('DD MMM YYYY');

  console.log('datedatedatedatedatedatedatedate', date);

  /**
   * The function `showDatePicker` sets the visibility of a date picker to true.
   **/
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  /**
   * The function `hideDatePicker` sets the visibility of a date picker to false.
   **/

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  /**
   * The handleConfirm function is used to handle the confirmation of a selected date and update the
   * state with the selected date.
   **/

  const handleConfirm = date => {
    hideDatePicker();
    setDate(date);
  };

  /**
   * The function `launchImageLibrarys` is an asynchronous function that logs a message, requests media
   * permission, launches the image library, and sets the first selected image as the current image.
   **/
  const launchImageLibrarys = async () => {
    try {
      console.log('jbdjkbdjkbds');
      const res = await mediaPermission();
      if (res) {
        const {assets, didCancel} = await launchImageLibrary();
        if (!didCancel) setImage(assets[0]);
      }
    } catch (error) {
      console.log(error, 'launchImageLibrarys');
    }
  };

  /**
   * The `onSubmit` function updates a user's profile with the provided data, including name, gender,
   * age, and profile image.
   **/
  const onSubmit = data => {
    dispatch(
      updateProfile({
        name: data?.name,
        gender: marked,
        age: selectedDate,
        profile_image: image || user?.profile_image,
      }),
    );
  };

  return {
    data,
    user,
    errors,
    control,
    selectedDate,
    isDatePickerVisible,
    marked,
    image,
    setMarked,
    showDatePicker,
    hideDatePicker,
    handleConfirm,
    launchImageLibrarys,
    handleSubmit,
    onSubmit,
    stringType,
  };
};

export default useEditProfile;
