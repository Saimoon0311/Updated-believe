import {Alert, BackHandler} from 'react-native';
import {useEffect, useState, useCallback, useRef} from 'react';
import useReduxStore from '../../hooks/useReduxStore';
import {
  deleteFullPlaylist,
  getPlaylistAudio,
  removeAudioPlaylist,
  sendAudioCount,
  updatePlayListAudios,
} from '../../store/actions/content-action';
import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {musicSwitch} from '../../utils/helper';
const menuData = [
  {
    id: 1,
    name: 'Edit Playlist',
  },
  {
    id: 2,
    name: 'Delete Playlist',
  },
  {
    id: 3,
    name: 'Add Tracks',
  },
];

const initialState = {audio_id: 0, type: ''};

/**
 * The `usePlaylistDetails` function is a custom hook that provides various functions and state
 * variables related to managing a playlist, including playing audio, editing the playlist, deleting
 * the playlist, and sorting the playlist.
 * @returns The function `usePlaylistDetails` is returning an object with the following properties:
 **/
const usePlaylistDetails = ({navigate, goBack, addListener}, {params}) => {
  const data = params;

  const [contentID, setContentID] = useState(initialState);
  const [playerState, setPlayerState] = useState('none');
  const [visible, setVisible] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [loop, setloop] = useState(true);
  const {getState, dispatch} = useReduxStore();
  const {position} = useProgress();
  const audioLopp = useRef(true);
  const isPlaying = Boolean(playerState == 'playing' || playerState == 3);

  const {playlistAudios, playlist} = getState('Content');
  const [playlistData, setPlaylistData] = useState(null);
  const showDelete = ({id: audio_id, type}) => setContentID({audio_id, type});

  /**
   * The hideMenu function sets the visibility of a menu to false.
   **/
  const hideMenu = () => setVisible(false);
  /**
   * The function `showMenu` sets the visibility of a menu to true.
   **/
  const showMenu = () => setVisible(true);
  /**
   * The function "hideDelete" sets the content ID to its initial state.
   **/
  const hideDelete = () => setContentID(initialState);
  /**
   * The function `onRefresh` dispatches an action to get the audio playlist based on the provided ID.
   **/
  const onRefresh = () => dispatch(getPlaylistAudio({id: data?.id}));

  /**
   * The `onSelect` function removes an audio playlist item and hides the delete option.
   **/
  const onSelect = () => {
    const param = {playlist_id: data?.id, ...contentID};
    dispatch(removeAudioPlaylist(param));
    hideDelete();
  };

  /**
   * The function "editPlaylist" hides the menu and navigates to the "EditPlaylist" page with the
   * provided data.
   **/
  const editPlaylist = () => {
    hideMenu();
    navigate('EditPlaylist', data);
  };

  /**
   * The `onDelete` function dispatches an action to delete a full playlist and then navigates back to
   * the previous page.
   **/
  const onDelete = () => {
    dispatch(deleteFullPlaylist({id: data?.id}));
    goBack();
  };
  /**
   * The function "onSort" hides the menu and navigates to the "SortPlaylist" page with the audio
   * playlist and playlist ID as parameters.
   **/
  const onSort = () => {
    hideMenu();
    navigate('SortPlaylist', {audio: playlistAudios, playlist_id: data.id});
  };

  /**
   * The deletePlaylist function prompts the user with a confirmation dialog to delete a playlist.
   **/
  const deletePlaylist = () => {
    hideMenu();
    Alert.alert(
      'Delete Playlist',
      'Are you sure you want to delete it.',
      [
        {
          text: 'Cancel',
          onPress: () => {
            return null;
          },
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: onDelete,
          style: 'Confirm',
        },
      ],
      {cancelable: true},
    );
    // navigation.navigate('EditPlaylist', data);
  };
  /**
   * The function `runOnLoop` toggles the value of a variable `loop` and updates the state of a
   * variable `audioLoop.current`.
   **/
  const runOnLoop = () => {
    audioLopp.current = !loop;
    setloop(!loop);
  };

  /**
   * The function `playAudio` logs a message and navigates to a music player screen with a playlist of
   * audio data, an index, and an audio loop.
   **/
  const playAudio = async index => {
    await musicSwitch(false);
    console.log('sdksdsdbsdbsdb', audioLopp.current);
    navigate('MusicPlayer', {
      data: playlistAudios,
      index,
      audioloop: audioLopp.current,
    });
  };

  /**
   * The function updates the playlist audios and dispatches an action to update the playlist.
   **/
  const updateSortArray = ({data: playlistAudios}) => {
    dispatch(updatePlayListAudios({playlistAudios, playlist}));
  };

  const goAudioBack = () => {
    goBack();
  };

  /** The code is creating an event listener that listens for the 'focus' event. When the 'focus' event
  is triggered, the `onRefresh` function is called immediately and then again after a delay of 1000
  milliseconds (1 second). The event listener is returned so that it can be removed later if needed. **/
  useEffect(() => {
    const event = addListener('focus', () => {
      onRefresh();
      setTimeout(() => {
        onRefresh();
      }, 1000);
    });
    return event;
  }, []);

  return {
    data,
    playlist,
    visible,
    menuData,
    playlistAudios,
    contentID,
    isPlaying,
    loop,
    trackIndex,
    position,
    hideMenu,
    hideDelete,
    showMenu,
    showDelete,
    onSelect,
    editPlaylist,
    deletePlaylist,
    playAudio,
    onRefresh,
    goAudioBack,
    runOnLoop,
    updateSortArray,
    onSort,
  };
};

export default usePlaylistDetails;
