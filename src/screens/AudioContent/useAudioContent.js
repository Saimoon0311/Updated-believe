import {useEffect, useRef, useState} from 'react';
import useFormHook from '../../hooks/useForm';
import Schemas from '../../utils/Validation';
import useReduxStore from '../../hooks/useReduxStore';
import {
  addAudioPlaylist,
  createPlaylist,
  getPlaylist,
} from '../../store/actions/content-action';
import * as ContentService from '../../services/content-service';
import {showSuccess} from '../../services/SnackBar';

/**
 * The `useAudioContent` function is a custom hook that provides various functionalities related to
 * audio content, such as toggling favorite status, opening and closing modals, handling form
 * submissions, and updating playlist data.
 * @returns The function `useAudioContent` returns an object with the following properties:
 **/
const useAudioContent = ({navigation, route}) => {
  // const data = route.params;
  const [data, setData] = useState(route.params);
  const [isTrackPlayerInit, setIsTrackPlayerInit] = useState(false);
  const {getState, dispatch} = useReduxStore();
  const {favoriteContentData, playlistData} = getState('Content');
  // console.log('useAudioContent', data);

  /**
   * The function `updateFavorite` is an asynchronous function that toggles the favorite status of an
   * audio content and updates the data accordingly.
   **/
  const updateFavorite = async () => {
    try {
      const {ok, data: apiData} = await ContentService.toggleFavorite({
        type: data?.type,
        audio_id: data?.id,
      });
      if (ok) {
        showSuccess(apiData?.message);
        setData({...apiData.audios, fav: true});
        // console.log('apiData', apiData.audios);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const valuedata = {...data, artist: 'Victoria M Gallagher'};
  /**
   * The hideLoader function sets the value of setIsTrackPlayerInit to true.
   **/
  const hideLoader = () => setIsTrackPlayerInit(true);
  // console.log('MusicPlayer', valuedata);

  // Request Playlist Modal
  /**`const modalizeRef = useRef(null);` is creating a ref object using the `useRef` hook. The initial
  value of the ref is set to `null`. This ref can be used to reference a Modal component in the code
  and perform actions on it, such as opening or closing the modal. **/
  const modalizeRef = useRef(null);
  const onIconOpen = () => modalizeRef.current?.open();
  const onIconClose = () => modalizeRef.current?.close();

  //List of Playlist Modal
  /**The line `const playlistRef = useRef(null);` is creating a ref object using the `useRef` hook. The
  initial value of the ref is set to `null`. This ref can be used to reference a Modal component in
  the code and perform actions on it, such as opening or closing the modal. **/
  const playlistRef = useRef(null);
  const onPlaylistOpen = () => {
    onIconClose();
    playlistRef.current?.open();
  };
  /**
   * The function `onPlaylistClose` adds an audio playlist to the state with the given data.
   **/
  const onPlaylistClose = listData => {
    playlistRef.current?.close();
    dispatch(
      addAudioPlaylist({
        type: data?.type,
        audio_id: data?.id,
        playlist_id: listData?.id,
      }),
    );
  };

  //List of Playlist Modal
  /**The line `const addPlaylistRef = useRef(null);` is creating a ref object using the `useRef` hook.
  The initial value of the ref is set to `null`. This ref can be used to reference a Modal component
  in the code and perform actions on it, such as opening or closing the modal. **/
  const addPlaylistRef = useRef(null);
  /**
   * The function `onAddOpen` closes the `playlistRef` and opens the `addPlaylistRef` if they exist.
   **/
  const onAddOpen = () => {
    playlistRef.current?.close();
    addPlaylistRef.current?.open();
  };
  /**
   * The function `onAddClose` closes the `addPlaylistRef` if it exists.
   **/
  const onAddClose = () => addPlaylistRef.current?.close();
  /**
   * The `onCancel` function closes the `addPlaylistRef` if it exists and opens the `playlistRef`.
   **/
  const onCancel = () => {
    addPlaylistRef.current?.close();
    playlistRef.current?.open();
  };

  // Form Submit Modal
  /**The line `const {handleSubmit, reset, errors, control} = useFormHook(Schemas.playlist);` is using
  object destructuring to extract the `handleSubmit`, `reset`, `errors`, and `control` variables
  from the result of calling the `useFormHook` function with the `Schemas.playlist` parameter. **/
  const {handleSubmit, reset, errors, control} = useFormHook(Schemas.playlist);
  /**
   * The function onSubmit takes a dataSet as input, dispatches a createPlaylist action with modified
   * dataSet, resets the form, and closes the add modal.
   **/
  const onSubmit = dataSet => {
    dispatch(
      createPlaylist({...dataSet, type: data?.type, audio_id: data?.id}),
    );
    reset('', {
      keepValues: false,
    });
    onAddClose();
  };

  // Playlist Data
  /**
   * The function `onRefresh` dispatches the `getPlaylist` action.
   **/
  const onRefresh = () => dispatch(getPlaylist());

  /**The code `() => { const event = navigation.addListener('focus', () => onRefresh()); return event;
  }` is creating an event listener that listens for the 'focus' event on the navigation object. When
  the 'focus' event is triggered, it calls the `onRefresh` function. The event listener is then
  returned so that it can be removed later if needed. **/
  useEffect(() => {
    const event = navigation.addListener('focus', () => onRefresh());
    return event;
  }, [playlistData]);

  return {
    data,
    valuedata,
    modalizeRef,
    playlistRef,
    addPlaylistRef,
    errors,
    control,
    isTrackPlayerInit,
    favoriteContentData,
    playlistData,
    onCancel,
    onIconOpen,
    onIconClose,
    onPlaylistOpen,
    onPlaylistClose,
    onAddOpen,
    onAddClose,
    hideLoader,
    onSubmit,
    handleSubmit,
    updateFavorite,
  };
};

export default useAudioContent;
