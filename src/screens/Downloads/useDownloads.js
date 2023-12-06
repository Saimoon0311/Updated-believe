import TrackPlayer from 'react-native-track-player';
import useReduxStore from '../../hooks/useReduxStore';
import {deleteAllFiles, deleteFiles} from '../../services/DownloadServices';
import {showError, showSuccess} from '../../services/SnackBar';
import cache from '../../utils/helper/cache';
import {useEffect} from 'react';
import {useState} from 'react';
import {Alert} from 'react-native';
import {musicSwitch} from '../../utils/helper';

/**
 * The `useDownloads` function is a custom hook in JavaScript that manages downloaded files, including
 * playing audio, deleting files, and updating the state.
 * @returns The function `useDownloads` returns an object with the following properties:
 **/
const useDownloads = ({navigation, route}) => {
  /** The line `const [downloads, setDownloads] = useState([]);` is declaring a state variable called
  `downloads` and a function called `setDownloads` to update the value of `downloads`. The initial
  value of `downloads` is an empty array `[]`. This state variable is used to store the downloaded
  files. **/
  const [downloads, setDownloads] = useState([]);
  /** The line `const {getState, dispatch} = useReduxStore();` is using the `useReduxStore` hook to get
  the `getState` and `dispatch` functions from the Redux store. **/
  const {getState, dispatch} = useReduxStore();

  /**
   * The playAudio function navigates to the MusicPlayer screen with the given parameters and sets the
   * isSeries flag to true.
   **/
  const playAudio = async params => {
    await musicSwitch(false);
    navigation.navigate('MusicPlayer', {...params, isSeries: true});
  };

  /**
   * The `onRowOpen` function closes a row in a specified rowMap after a delay of 2000 milliseconds.
   * @param rowKey - The `rowKey` parameter is the unique identifier for the row that is being opened. It
   * is used to access the specific row in the `rowMap` object.
   * @param rowMap - The `rowMap` parameter is an object that maps row keys to row references. It is
   * typically used in a list or table component to keep track of the open/close state of each row. In
   * the `onRowOpen` function, it is used to close the row with the specified `row
   **/
  const onRowOpen = (rowKey, rowMap) => {
    setTimeout(() => {
      rowMap[rowKey]?.closeRow();
    }, 2000);
  };

  /** The lines `const [audioPath, setAudioPath] = useState([]);` and `const [imagePath, setImagePath] =
useState([]);` are declaring state variables `audioPath` and `imagePath` respectively, and functions
`setAudioPath` and `setImagePath` to update their values. The initial values of `audioPath` and
`imagePath` are empty arrays `[]`. These state variables are used to store the paths of downloaded
audio files and image files respectively. **/
  const [audioPath, setAudioPath] = useState([]);
  const [imagePath, setImagePath] = useState([]);

  /**
   * The showAlert function displays an alert asking the user if they want to delete all downloaded
   * content and calls the deleteDownloads function if the user selects "OK".
   **/
  const showAlert = () => {
    Alert.alert(
      'Clear Downloads',
      'Are you sure you want to delete all downloaded content?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => deleteDownloads()},
      ],
    );
  };

  /**
   * The function `deleteDownloads` deletes all downloaded files and updates the cache and state
   * accordingly.
   **/
  const deleteDownloads = async type => {
    try {
      const downloadFiles = cache.get('downloadedFiles');
      if (downloadFiles != null && downloadFiles.length > 0) {
        await downloadFiles.map(res => {
          imagePath.push(res.cover_image || res.image);
        });
        await downloadFiles.map(res => {
          audioPath.push(res.path);
        });
        await deleteAllFiles(imagePath);
        await deleteAllFiles(audioPath);
        cache.store('downloadedFiles', []);
        setDownloads([]);
        !type && showSuccess('All download file has been deleted');
      } else !type && showError('No downloads found!');
    } catch (error) {
      console.log('25', error);
    }
  };

  /**
   * The function `deleteFilesFunc` deletes files from the `downloads` array, updates the cache, and
   * displays a success message.
   * @param data - The `data` parameter is not used in the `deleteFilesFunc` function. It is not
   * necessary for the function and can be removed.
   * @param index - The `index` parameter is the index of the item in the `downloads` array that you want
   * to delete. It is used to access the specific item in the array and perform the deletion operations
   * on its properties.
   **/
  const deleteFilesFunc = async (data, index) => {
    try {
      await deleteFiles(downloads[index].cover_image || downloads[index].image);
      await deleteFiles(downloads[index].path);
      await cache.store(
        'downloadedFiles',
        downloads.filter(res => res.id != downloads[index].id),
      );
      const filterFiles = (await cache.get('downloadedFiles')) || [];
      setDownloads(filterFiles);
      showSuccess('File Deleted Successfuly');
    } catch (error) {}
  };

  /** The `useEffect` hook is used to perform side effects in a functional component. In this case, the
`useEffect` hook is used to fetch the downloaded files from the cache and update the `downloads`
state variable with the fetched data. **/
  useEffect(() => {
    const downloads = cache.get('downloadedFiles') || [];
    setDownloads(downloads);
    const event = navigation.addListener('focus', () => {
      const downloads = cache.get('downloadedFiles') || [];
      setDownloads(downloads);
      // deleteFilesFunc();
    });
    return event;
  }, []);

  return {
    data: downloads,
    onPress: playAudio,
    playAudio,
    deleteFilesFunc,
    onRowOpen,
    deleteAllDownloads: showAlert,
  };
};

export default useDownloads;
