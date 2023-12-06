import {useState} from 'react';
import Schemas from '../../utils/Validation';
import useFormHook from '../../hooks/useForm';
import useReduxStore from '../../hooks/useReduxStore';
import * as ImagePicker from 'react-native-image-picker';
import {mediaPermission} from '../../hooks/useMediaPermission';
import {editPlaylist} from '../../store/actions/content-action';

/**
 * The `useEditPlaylist` function is a custom hook in JavaScript that allows the user to edit a
 * playlist by selecting an image from their device's library and dispatching an action with the
 * updated playlist information.
 * @returns an object with the following properties:
 **/
const useEditPlaylist = ({navigation: {goBack}, route}) => {
  /** The code is performing the following tasks: **/
  const data = route.params;
  const {handleSubmit, errors, control} = useFormHook(Schemas.playlist);
  const {getState, dispatch} = useReduxStore();
  const {playlist} = getState('Content');

  const [image, setImage] = useState('');

  /**
   * The function `launchImageLibrarys` allows the user to select an image from their device's library
   * and sets it as the current image.
   **/
  const launchImageLibrarys = async () => {
    try {
      const res = await mediaPermission();
      if (res) {
        const {assets, didCancel} = await ImagePicker.launchImageLibrary();
        if (!didCancel) setImage(assets[0]);
      }
    } catch (error) {
      console.log(error, 'launchImageLibrarys');
    }
  };

  /**
   * The `onSubmit` function is used to edit a playlist by dispatching an action with the updated
   * playlist information and then navigating back to the previous page.
   **/
  const onSubmit = dataName => {
    // console.log('dataName', dataName);
    dispatch(
      editPlaylist({
        id: data?.id,
        name: dataName?.name,
        image: image || data?.image,
      }),
    );
    goBack();
  };

  return {
    data,
    playlist,
    errors,
    control,
    goBack,
    onSubmit,
    handleSubmit,
    launchImageLibrarys,
  };
};

export default useEditPlaylist;
