import {Alert, BackHandler} from 'react-native';
import React, {useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import API from '../../services/API';
import {showError, showSuccess} from '../../services/SnackBar';

const initialState = {audio_id: 0, type: ''};

/**
 * The `useSortPlaylist` function is a custom hook in JavaScript that manages the state and
 * functionality for sorting and updating a playlist of audio tracks.
 * @returns The function `useSortPlaylist` is returning an object with the following properties:
 **/
const useSortPlaylist = ({navigate, goBack, addListener}, {params}) => {
  // const data = params;
  const {playlist_id, audio} = params;
  const [contentID, setContentID] = useState(initialState);
  const [playerState, setPlayerState] = useState('none');
  const [data, setData] = useState([...audio]);
  const [trackIndex, setTrackIndex] = useState(0);
  const [saveSort, setSaveSort] = useState(false);

  /** The line `const isPlaying = Boolean(playerState == 'playing' || playerState == 3);` is checking if
  the `playerState` variable is equal to the string `'playing'` or the number `3`. **/
  const isPlaying = Boolean(playerState == 'playing' || playerState == 3);

  /**
   * The function "hideDelete" sets the content ID to its initial state.
   **/
  const hideDelete = () => setContentID(initialState);

  /**
   * The function `showDelete` sets the content ID based on the provided audio ID and type.
   **/
  const showDelete = ({id: audio_id, type}) => setContentID({audio_id, type});

  /**
   * The `onSelect` function hides the delete option.
   **/
  const onSelect = () => {
    hideDelete();
  };

  /**
   * The function `updateSortArray` updates the sort array with new data and sets a flag to save the
   * sort.
   **/
  const updateSortArray = ({data}) => {
    setSaveSort(true);
    setData(data);
  };

  /**
   * The updateArry function is an asynchronous function in JavaScript.
   **/
  const updateArry = async () => {
    const {ok, originalError} = await API.post('/drag-playlist-audios', {
      playlist_id,
      data,
    });
    if (ok) {
      showSuccess('Playlist successfully updated');
      setSaveSort(false);
      goBack();
    } else showError(originalError);
  };

  /**
   * The function showAlert displays an alert asking the user if they want to exit and returns true.
   * @returns The function `showAlert` is returning `true`.
   **/
  const showAlert = () => {
    Alert.alert('Are you sure you want to exit?', 'Your changes will be lost', [
      {
        text: 'Exit',
        onPress: () => goBack(),
        style: 'cancel',
      },
      {text: 'Stay'},
    ]);
    return true;
  };

  /** The `useFocusEffect` hook is used to perform side effects when the screen is focused. In this
  case, it is used to add an event listener to the hardware back button press. **/
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (saveSort) {
          showAlert();
          return true;
        } else {
          return false;
        }
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [saveSort]),
  );
  return {
    data,
    playlistAudios: data,
    contentID,
    isPlaying,
    trackIndex,
    position: '',
    hideDelete,
    showDelete,
    onSelect,
    onRefresh: () => {},
    updateSortArray,
    saveSort,
    updateArry,
  };
};

export default useSortPlaylist;
