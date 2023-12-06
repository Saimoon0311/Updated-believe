import useReduxStore from '../../hooks/useReduxStore';
import API from '../../services/API';
import {
  addAudioPlaylist,
  removeAudioPlaylist,
} from '../../store/actions/content-action';
import {useState} from 'react';

/**
 * The `useAddPlayListData` function is a custom hook in JavaScript that manages state variables and
 * functions related to adding and removing audio items from a playlist.
 * @param navigation - The `navigation` parameter is an object that contains information about the
 * navigation state of the app. It is typically used to navigate between screens or components in a
 * React Native app.
 * @returns The function `useAddPlayListData` returns an object with the following properties:
 **/
const useAddPlayListData = (navigation, {params}) => {
  const {dispatch, getState} = useReduxStore();
  const {playlistAudios} = getState('Content');
  const [audio, setAudios] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState('');
  const [playlist, setPlaylist] = useState(playlistAudios);

  /**
   * The function `getAudios` is an asynchronous function that retrieves audio data from a specified URL
   * and updates the state variables `audios` and `filterData` with the retrieved data.
   **/
  const getAudios = async url => {
    const {ok, data} = await API.get(url);
    if (ok) {
      setAudios(data?.audios);
      setFilterData(data?.audios);
    } else console.log('data', data);
  };

  /**
   * The onChange function updates the search value based on the input event.
   **/
  const onChange = e => setSearch(e);

  /**
   * The `onSearch` function calls the `getAudios` function with a search query parameter.
   **/
  const onSearch = () => {
    getAudios(`search-audios?title=${search}`);
  };

  /**
   * The `onAddPlaylist` function dispatches an action to add an audio playlist with the specified
   * type, audio ID, and playlist ID.
   **/
  const onAddPlaylist = item => {
    dispatch(
      addAudioPlaylist({
        type: item?.type,
        audio_id: item?.id,
        playlist_id: params?.PlaylistCard?.id,
      }),
    );
  };

  /**
   * The `onRemovePlaylist` function dispatches an action to remove an audio item from a playlist.
   **/
  const onRemovePlaylist = item => {
    dispatch(
      removeAudioPlaylist({
        playlist_id: params?.PlaylistCard?.id,
        type: item?.type,
        audio_id: item?.id,
      }),
    );
  };

  /**
   * The function `onRefresh` calls the `onSearch` function.
   **/
  const onRefresh = () => onSearch();

  return {
    audio: filterData,
    onSearch,
    onAddPlaylist,
    onRefresh,
    onRemovePlaylist,
    search,
    AudioList: playlist,
    onChange,
  };
};

export default useAddPlayListData;
