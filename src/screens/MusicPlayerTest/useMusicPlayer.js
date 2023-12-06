import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import useFormHook from '../../hooks/useForm';
import Schemas from '../../utils/Validation';
import useReduxStore from '../../hooks/useReduxStore';
import {
  addAudioPlaylist,
  createPlaylist,
  getPlaylist,
  handleAppStreak,
  sendAudioCount,
} from '../../store/actions/content-action';
import ContentService from '../../services/content-service';
import {showError, showSuccess} from '../../services/SnackBar';
import {Alert, AppState, BackHandler, Platform} from 'react-native';
import {store} from '../../store/store';
import {saveFiles} from '../../store/actions/files-action';
import cache from '../../utils/helper/cache';
import {cacheMedia, getCacheMedia} from '../../services/DownloadServices';
import TrackPlayer, {
  useTrackPlayerEvents,
  Event,
  useProgress,
  Capability,
  usePlaybackState,
  State,
  RepeatMode,
} from 'react-native-track-player';
import {useCallback} from 'react';
import {playMusic, toggleMusic} from '../../store/actions/music-action';
import {getValue, storeValue} from '../../services/storage';
import {updateAuth} from '../../store/actions/auth-action';
import API from '../../services/API';
import {musicSwitch} from '../../utils/helper';
import sagaTypes from '../../store/saga-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
const streaksRoutes = ['meditation', 'hypnosis', 'affirmation'];

/** useMusicPlayer is a function then return
 *     data: getParamsData,
 *   valuedata: data,
 *   modalizeRef,
 *   playlistRef,
 *   addPlaylistRef,
 *   errors,
 *   control,
 *   favoriteContentData,
 *   playlistData,
 *   onCancel,
 *   onIconOpen,
 *   onIconClose,
 *   onPlaylistOpen,
 *   onPlaylistClose,
 *   onAddOpen,
 *   onAddClose,
 *   onSubmit,
 *   handleSubmit,
 *   updateFavorite,
 *   startDownload,
 *   isDownload,
 *   isCompleted,
 *   progressVlaue: 0,
 *   cancelDownloadFun: () => {},
 *   imageDownload,
 *   onSlide,
 *   backwardAudio,
 *   forwardAudio,
 *   position,
 *   duration,
 *   currentAudioposition,
 *   setSound,
 *   play,
 *   checkParamsType,
 *   index,
 *   previousAudio,
 *   nextAudio,
 *   isSubscribed,
 *   runOnLoop,
 *   loop,
 *   isPlayAble,
 *   showEndScreen,
 *   postDuration,
 *  multipule properties  **/

const useMusicPlayer = (navigation, {params}) => {
  // const checkBG = Boolean(getValue('background') == 'true');
  const [checkBG, setCheckBG] = useState(null);
  const checkBGRef = useRef(null);
  /* The above code is using the `useLayoutEffect` hook in React to perform a side effect. It checks if
 `checkBG` is truthy and if so, it dispatches a `playMusic` action with the `appMusic` property set
 to `false`. The empty dependency array `[]` ensures that the effect is only run once, similar to
 the `componentDidMount` lifecycle method. */
  // useLayoutEffect(async () => {
  //   // if (checkBG) {
  //   //  musicSwitch(false);

  //   await TrackPlayer.reset();
  //   // dispatch(playMusic({appMusic: false}));
  //   // setFun(false);
  //   // }
  // }, []);

  // useEffect(() => {
  //   if (fub && checkBG) {
  //     musicSwitch(false);
  //     // dispatch(playMusic({appMusic: false}));
  //     setFun(false);
  //   }
  // }, []);

  /** The above code is an asynchronous function that retrieves a value from AsyncStorage using the key
  'background'. It then logs the value to the console and sets it to the state variable 'checkBG'.
  It also assigns the value to the ref variable 'checkBGRef.current'. After a timeout of 1 second,
  it logs the values of 'checkBG' and 'checkBGRef.current' to the console. There is a commented out
  if statement that suggests there may be additional logic related to the 'fub' and 'checkBG'
  variables, but it is currently disabled. **/
  useEffect(async () => {
    const val = await AsyncStorage.getItem('background');
    console.log('asyn val on useeffect check', val);
    setCheckBG(val);
    checkBGRef.current = val;
    setTimeout(() => {
      console.log('check val after set on state', checkBG, checkBGRef.current);
    }, 1000);
    // if (fub && checkBG) {
    //   musicSwitch(false);
    //   // dispatch(playMusic({appMusic: false}));
    //   setFun(false);
    // }
  }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (fub && checkBG) {
  //       musicSwitch(false);
  //       // dispatch(playMusic({appMusic: false}));
  //       setFun(false);
  //     }
  //   }, 100);
  // }, []);

  const {getState, dispatch} = useReduxStore();
  const {user} = getState('Auth');
  const playMinutesRef = useRef(false);
  const {hitControlFirst} = getState('hit_Control');
  const checkParamsType = Array.isArray(params.data);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const isSubscribed = Boolean(user?.is_subscribed);
  const allData = checkParamsType ? params.data : [];
  const getLength = allData.length;
  const [index, setIndex] = useState(checkParamsType ? params.index : 0);
  const [useEffectRun, setUseEffectRun] = useState(false);
  const [getParamsData, setGetParamsData] = useState(
    checkParamsType ? allData[index] : params,
  );
  // console.log('params.loop', params.audioloop);
  const playerState = usePlaybackState();
  const [data, setData] = useState(getParamsData);
  const [isDownload, setIsDownload] = useState(false);
  const [imageDownload, setImageDownload] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [hitFirst, setHitFirst] = useState(false);
  const [apiFirst, setAPIFirst] = useState(false);
  const PlatformIOS = Platform.OS == 'ios';
  const {favoriteContentData, playlistData, playlist} = getState('Content');
  const audioRef = useRef(null);
  const imageRef = useRef(null);
  const [loop, setloop] = useState(checkParamsType ? params.audioloop : false);
  const isPlayAble = Boolean(getLength > 0);

  let playCountAPI = 1;
  let playMusicAPI = 1;

  /**
   * The updateFavorite function is an asynchronous function.
   **/
  const updateFavorite = async () => {
    console.log('data', data?.id, data?.type);
    try {
      const {ok, data: apiData} = await ContentService.toggleFavorite({
        type: data?.type,
        audio_id: data?.id,
      });
      console.log('apiDataapiDataapiData', apiData);
      if (ok) {
        showSuccess(apiData?.message);
        setData(apiData.audios);
      } else {
        showError(apiData?.message);
      }
    } catch (error) {
      console.log('sefsdf', error);
    }
  };

  /**
   * The function `alertMessage` displays an alert with a title and message, and provides options for
   * the user to confirm, cancel, or save and confirm.
   * @param title - The title parameter is a string that represents the title of the alert message. It
   * is displayed at the top of the alert dialog.
   * @param message - The `message` parameter is a string that represents the main content or
   * information that you want to display in the alert dialog. It can be a message, a question, or any
   * other text that you want to show to the user.
   * @param onConfirm - The onConfirm parameter is a function that will be called when the user presses
   * the "Confirm" button in the alert dialog.
   * @param onCancel - The `onCancel` parameter is a function that will be called when the user presses
   * the "Cancel" button in the alert dialog.
   * @param onSave - The `onSave` parameter is a function that will be called when the user presses the
   * "Save And Confirm" button in the alert dialog.
   **/
  const alertMessage = (title, message, onConfirm, onCancel, onSave) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Cancel',
          onPress: onCancel,
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: onConfirm,
        },
        {
          text: 'Save And Confirm',
          onPress: onSave,
        },
      ],
      {
        userInterfaceStyle: 'light',
      },
    );
  };

  // MUSIC ALL FUNCTION

  const {position, duration} = useProgress();
  const currentPostionRef = useRef(position);

  const [play, setPlay] = useState(false);

  /**
   * The function `setSound` is an asynchronous function that checks the platform (iOS or Android),
   * retrieves the current track, and either pauses or plays the track based on the `play` state and
   * the platform condition.
   **/
  const setSound = async () => {
    const IOSCondition = Boolean(
      stateRef.current != 'loading' && stateRef.current != 'idle',
    );
    const ANDROIDCondition = Boolean(
      stateRef.current != 'loading' && stateRef.current != 'idle',
      // stateRef.current != 0 &&
      // // stateRef.current != 3 &&
      // stateRef.current != 8,
    );
    console.log(
      'ANDROIDConditionANDROIDConditionANDROIDConditionANDROIDConditionANDROIDCondition',
      ANDROIDCondition,
    );
    const checkPlatform = PlatformIOS ? IOSCondition : ANDROIDCondition;
    try {
      const track = await TrackPlayer.getCurrentTrack();
      console.log('tsdfsdfsdfsdfsfsdfsdfrack', track);
      // if (track !== null) {
      if (track !== null && checkPlatform) {
        if (play) {
          setPlay(false);
          TrackPlayer.pause();
        } else {
          console.log('check else', play);
          TrackPlayer.play();
          setPlay(true);
          if (!apiFirst && !checkParamsType) {
            // if (!apiFirst) {
            !data.isBadgeCourse &&
              data.check_type != 'lesson_content' &&
              (await postDuration());
            if (streaksRoutes.includes(data?.type)) dispatch(handleAppStreak());
            !data.isBadgeCourse && onRefreshCount();
            setAPIFirst(true);
          }
          if (!hitFirst) {
            // hitOnStart();
            setHitFirst(true);
          }
        }
      }
      // } else initiliazePlayerOn(data);
    } catch (error) {
      console.log('error ===>', error);
    }
  };

  /**
   * The function getCurrentTrackNumber returns the current track number using the TrackPlayer library
   * in JavaScript.
   **/
  const getCurrentTrackNumber = async () => await TrackPlayer.getCurrentTrack();

  /** The above code is a JavaScript function called `initializePlayer`. It takes two parameters:
  `isStop` and `trackData`. **/
  const initiliazePlayer = useCallback(async (isStop, trackData) => {
    try {
      // await TrackPlayer.setupPlayer();
      await TrackPlayer.add(trackData);
      await TrackPlayer.setRepeatMode(RepeatMode.Off);
      await TrackPlayer.updateOptions({
        stopWithApp: true,
        capabilities: [Capability.Play, Capability.Pause, Capability.Stop],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.Stop,
        ],
      });
      setUseEffectRun(true);
      if (!isStop) {
        TrackPlayer.play();
        setPlay(!isStop);
        if (checkParamsType) {
          console.log('jsbdvjksbdjvbdjsbvjbdjvbsdjbvdsbv');
          !trackData.isBadgeCourse &&
            trackData.check_type != 'lesson_content' &&
            (await postDuration());
          if (streaksRoutes.includes(trackData?.type))
            dispatch(handleAppStreak());
          !trackData.isBadgeCourse && onRefreshCount();
        }
      } else if (isStop) {
        TrackPlayer.pause();
        setPlay(!isStop);
      }
    } catch (error) {
      let e = error;
      if (
        e.toString() ==
        'Error: The player has already been initialized via setupPlayer.'
      ) {
        initiliazePlayerAfterError(isStop, trackData);
      } else {
        await TrackPlayer.setupPlayer();
        initiliazePlayerAfterError(isStop, trackData);
      }
      // navigation.goBack();
      // showError('Failed to fetch data');
      // dispatch(updateAuth({loading: false}));
    }
  });

  /** The above code is a JavaScript function that initializes a player after an error occurs. It uses
  the TrackPlayer library to set up the player, add a track, set repeat mode, update options, and
  play or pause the track based on the provided parameters. If an error occurs during this process,
  it logs the error, navigates back, and shows an error message. **/
  const initiliazePlayerAfterError = useCallback(async (isStop, trackData) => {
    try {
      // await TrackPlayer.setupPlayer();
      await TrackPlayer.add(trackData);
      await TrackPlayer.setRepeatMode(RepeatMode.Off);
      await TrackPlayer.updateOptions({
        stopWithApp: true,
        capabilities: [Capability.Play, Capability.Pause, Capability.Stop],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.Stop,
        ],
      });
      setUseEffectRun(true);
      if (!isStop) {
        TrackPlayer.play();
        setPlay(!isStop);
        if (checkParamsType) {
          console.log('jsbdvjksbdjvbdjsbvjbdjvbsdjbvdsbv');
          !trackData.isBadgeCourse &&
            trackData.check_type != 'lesson_content' &&
            (await postDuration());
          if (streaksRoutes.includes(trackData?.type))
            dispatch(handleAppStreak());
          !trackData.isBadgeCourse && onRefreshCount();
        }
      } else if (isStop) {
        TrackPlayer.pause();
        setPlay(!isStop);
      }
    } catch (error) {
      console.log('sdfvsfsdfsdfsdfsdfsdfsdfsdfsd', error);
      navigation.goBack();
      showError('Failed to fetch data');
      // dispatch(updateAuth({loading: false}));
    }
  });

  /** The above code is declaring a variable called "currentAudioposition" and assigning it the value of
  "position / duration". It is calculating the current position of an audio file by dividing the
  current position (position) by the total duration of the audio file (duration). **/
  var currentAudioposition = position / duration;
  currentPostionRef.current = position;

  /**
   * The function `postDuration` posts the duration of a video or content to an API endpoint.
   **/
  const postDuration = async (time, PlayCount) => {
    console.log('Play minutesdfdsfdsfdssdsdsdsdsdsd ', PlayCount);
    const bodyKey = PlayCount
      ? {
          platform: Platform.OS,
          play_count: PlayCount,
        }
      : {};
    const ok = await API.post('/play-minutes', {
      minutes: time ?? currentPostionRef.current,
      content_minutes: checkParamsType ? data.duration : params.duration,
      id: checkParamsType ? data?.id : params?.id,
      type: checkParamsType ? data?.type || 'series' : params?.type || 'series',
      ...bodyKey,
    });
    console.log('okokokokokokok', ok.data);
  };

  /**
   * The function `postCourseDuration` is an asynchronous function that sends a POST request to a
   * specific API endpoint with some data and logs the response data and a current position reference.
   **/
  const postCourseDuration = async PlayCount => {
    const bodyKey = PlayCount
      ? {
          platform: Platform.OS,
          play_count: PlayCount,
        }
      : {};
    const {data} = await API.post('/play-minutes-course', {
      minutes: params.duration,
      content_minutes: params.duration,
      lesson_content_id: params.id,
      isBadgeCourse: params.isBadgeCourse,
      ...bodyKey,
    });
    console.log('datadatadataxdrada', currentPostionRef.current, data);
  };

  /**
   * The function `onSlide` seeks the audio track to a specific position based on the slide value.
   **/
  const onSlide = async slide => {
    await TrackPlayer.seekTo(slide * duration);
  };

  /**
   * The function `backwardAudio` seeks the audio track to a position 30 seconds earlier if the current
   * position is valid.
   **/
  const backwardAudio = () => {
    const isValidPosition = Boolean(
      position && position >= 30 && duration >= 30,
    );
    if (isValidPosition) TrackPlayer.seekTo(position - 30);
  };

  /**
   * The function `forwardAudio` seeks forward by 30 seconds if the duration is greater than 30 seconds
   * and the current position is less than the duration.
   **/
  const forwardAudio = () => {
    if (duration > 30 && duration > position) TrackPlayer.seekTo(position + 30);
  };

  /**
   * The function `closeAudio` removes the audio track using the TrackPlayer library.
   **/
  const closeAudio = async () => {
    await TrackPlayer.remove();
  };

  /** The above code is written in JavaScript. It declares a constant variable `stateRef` using the
  `useRef` hook. The initial value of `stateRef` is set to the string `'loading'`. **/
  const stateRef = useRef('loading');

  /** The above code is a JavaScript arrow function that checks the value of `stateRef.current` and
  performs different actions based on its value. **/
  useEffect(() => {
    if (stateRef.current == 'loading') {
      dispatch(updateAuth({loading: true}));
    } else if (stateRef.current == 'ready') {
      dispatch(updateAuth({loading: false}));
      stateRef.current = checkParamsType ? 'playing' : 'paused';
    }
  }, []);

  /** The above code is a JavaScript function that sets up a player and performs various actions related
  to playing music. **/
  useEffect(async () => {
    console.log(
      'before on muisc plyer check bg value dsddddd',
      getValue('background'),
    );
    // await TrackPlayer.reset();
    console.log(
      'on muisc plyer check bg value dsddddd',
      getValue('background'),
    );
    setTimeout(() => {
      initiliazePlayer(checkParamsType ? play : true, data);
    }, 300);
  }, []);

  /** The above code is a JavaScript function that returns an async function. **/
  useEffect(() => {
    return async () => {
      if (PlatformIOS) {
        await TrackPlayer.updateOptions({stopWithApp: true});
        // await TrackPlayer.res
        // await TrackPlayer.destroy();
      }
      await TrackPlayer.reset();
      console.log(
        'checkBGcheckBGcheckBGcheckBGcheckBGcheckBGcheckBGcheckBGcheckBGcheckBG',
        checkBGRef.current,
        getValue('background'),
      );

      if (checkBGRef.current == 'true') {
        console.log('jksbdfjsbdfjbdsfdjksb');
        // PlatformIOS && (await TrackPlayer.setupPlayer());
        await musicSwitch(checkBGRef.current);
        // dispatch(playMusic({appMusic: getValue('background') == 'true'}));
      }

      // if (checkBG && !PlatformIOS) {
      //   const num = await getCurrentTrackNumber();
      //   console.log('ijkadgvjkdsvjkbdsjkvbdjs,bvds', num);
      //   // !PlatformIOS && (await TrackPlayer.remove(num));
      // }
      // backHandler.remove();
    };
  }, []);

  /**
   * The function `onRefreshCount` logs a message and dispatches an action to send audio count with the
   * provided data.
   **/
  const onRefreshCount = () => {
    // if (!addToPlaylist && !isSeries) {
    // }
    console.log(
      'jkabdkjcbsdbbsdvbjsdbjbsdvbsdkb ksdbb sbjk bksdb bskdb bsd jkbsjk bdb kdb',
    );
    dispatch(
      sendAudioCount({
        id: data?.id,
        type: data?.type || 'series',
      }),
    );
    console.log('onRefreshCount');
  };

  const forHitAPIONPlaylist = async trackData => {
    console.log(
      'rttttttttytytytytytytyytytytytyttytytytyttytytty',
      trackData.title,
    );
    playMinutesRef.current = true;
    if (apiFirst && trackData.check_type != 'lesson_content') {
      postDuration(trackData.duration);
    }
    if (trackData.isBadgeCourse) {
      await postCourseDuration();
    }
  };

  /** The above code is using the `useTrackPlayerEvents` function to listen for specific events related to
a media player. The events being listened for are `PlaybackQueueEnded`, `RemotePause`, `RemotePlay`,
and `RemoteStop`. **/
  useTrackPlayerEvents(
    [
      Event.PlaybackQueueEnded,
      Event.RemotePause,
      Event.RemotePlay,
      Event.RemoteStop,
    ],
    async event => {
      console.log('ONEdnd ', 1 + 1);
      const {type} = event;
      console.log('typetypetypetypetypetypetypetypetypetype', type);
      if (type == Event.PlaybackQueueEnded) {
        const time = new Date().getMilliseconds();
        index > 0 && playMusicAPI++;
        if (!checkParamsType) {
          await TrackPlayer.updateOptions({stopWithApp: true});
          await TrackPlayer.reset();
          playMinutesRef.current = true;
          setShowEndScreen(true);
          if (apiFirst && data.check_type != 'lesson_content') {
            postDuration(data.duration, playCountAPI++);
          }
          if (params.isBadgeCourse) {
            await postCourseDuration(playCountAPI++);
          }
        } else if (checkParamsType && PlatformIOS) {
          nextAudio(index);
          postDuration(allData[index].duration);
        }
      }
      if (type == Event.RemotePause || type == Event.RemotePlay) {
        console.log('kdkfhdkfhkdhf');
        setPlay(!play);
      }
      if (type == Event.RemoteStop) setPlay(false);
    },
  );

  /**
   * The function `checkTime` checks if certain conditions are met and performs an action if they are,
   * otherwise it logs some information.
   **/
  const checkTime = () => {
    if (
      checkParamsType &&
      position.toFixed(0) == duration.toFixed(0) &&
      useEffectRun &&
      duration.toFixed(0) != 0
      // duration == null &&
      // duration == undefined
    ) {
      console.log('Next audio');
      nextAudio(index);
      postDuration(allData[index].duration);
    } else {
      console.log(
        'jsdbjksbdjkvbdsjbv jkds',
        position.toFixed(0),
        duration.toFixed(0),
      );
    }
  };

  /** The above code is a JavaScript arrow function that checks if the operating system (OS) is Android.
  If the OS is Android, it calls the function `checkTime()`. **/
  useEffect(() => {
    if (Platform.OS == 'android') checkTime();
  }, [currentPostionRef.current]);

  /**
   * The function `state` retrieves the current state of the player using the `TrackPlayer.getState()`
   * method and assigns it to the `playerState` variable.
   **/
  const state = async () => {
    const playerState = await TrackPlayer.getState();
    stateRef.current = playerState;
  };
  state();

  useEffect(() => {
    if (stateRef.current == 'paused') setPlay(false);
  }, [stateRef.current]);

  /** The above code is a JavaScript function that sets up a listener for changes in the app state. When
  the app state changes, the function checks the current state and performs different actions based
  on the conditions. **/
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async stat => {
      console.log('on ksbkbdskbdsbvbdsvbdsbvbdsjkvbdbs');

      if (
        stat == 'active' &&
        stateRef.current == 'paused' &&
        !checkParamsType &&
        !play
      ) {
        console.log('Backgroscsdcsdcsdcdsunxxxxxxd');
        setTimeout(async () => {
          await TrackPlayer.pause();
          setPlay(false);
        }, 10);
      } else if (
        stat == 'active' &&
        stateRef.current == 'playing' &&
        !checkParamsType &&
        play
      ) {
        await TrackPlayer.play();
        setPlay(true);
        console.log('Backgrounxxxxxxd');
      } else if (
        stat == 'active' &&
        stateRef.current == 'ready' &&
        !checkParamsType &&
        !play
      ) {
        console.log('Backgroscsdcdcxcxcxsdcsdcdsunxxxxxxd');
        await TrackPlayer.pause();
        setPlay(false);
        initiliazePlayer(checkParamsType ? play : true, data);
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  //  Cancel download

  /**
   * The `cancelDownloadFun` function cancels any ongoing audio or image downloads and logs any errors.
   **/
  const cancelDownloadFun = () => {
    audioRef.current?.cancel(err => console.log('audio', err));
    imageRef.current?.cancel(err => console.log('audio', err));
  };

  // Request Playlist Modal
  const modalizeRef = useRef(null);
  const onIconOpen = () => modalizeRef.current?.open();
  const onIconClose = () => modalizeRef.current?.close();

  //List of Playlist Modal
  const playlistRef = useRef(null);
  const onPlaylistOpen = () => {
    onIconClose();
    playlistRef.current?.open();
  };
  /**
   * The function `onPlaylistClose` adds an audio playlist to the state and refreshes the page after a
   * delay.
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
    setTimeout(() => {
      onRefresh();
    }, 100);
  };

  // for start dwonload

  /**
   * The `startDownload` function downloads media files, caches them, and saves them to the device.
   * @returns The function `startDownload` does not have a return statement.
   **/
  const startDownload = async () => {
    try {
      const downloadedFiles = cache.get('downloadedFiles');
      const isFile = Boolean(
        downloadedFiles.length &&
          downloadedFiles.find(res => (res.id == data?.id ? true : false)),
      );
      if (isFile) return showSuccess('Media is already exists in downloads');
      setImageDownload(true);
      // showError('if you leave the screen your download will be canceled.');
      imageRef.current = cacheMedia(data?.path, () => {});
      audioRef.current = cacheMedia(data?.cover_image || data?.image, () => {});

      await imageRef.current.result;
      await audioRef.current.result;

      const audioFile = await getCacheMedia(data?.path);
      const coverImage = await getCacheMedia(data?.cover_image || data?.image);

      const downloadMedia = {
        ...data,
        cover_image: PlatformIOS
          ? coverImage.path
          : 'file://' + coverImage.path,
        path: PlatformIOS ? audioFile.path : 'file://' + audioFile.path,
        url: PlatformIOS ? audioFile.path : 'file://' + audioFile.path,
      };
      store.dispatch(saveFiles(downloadMedia));
      setIsCompleted(true);
      showSuccess('Your download has been completed');
    } catch (error) {
      console.log('error download', error);
    } finally {
      setImageDownload(false);
      setTimeout(() => {
        setIsDownload(false);
        setIsCompleted(false);
      }, 2000);
    }
  };

  // prevous audio

  /**
   * The function `previousAudio` is used to play the previous audio track in a playlist.
   **/
  const previousAudio = async i => {
    const num = await getCurrentTrackNumber();
    if (i > 0) {
      play && (await postDuration());
      setPlay(false);
      setAPIFirst(false);
      // await forHitAPIONPlaylist(allData[i]);
      setIndex(prev => prev - 1);
      setGetParamsData(() => allData[i - 1]);
      setData(() => allData[i - 1]);
      // closeAudio();
      await TrackPlayer.updateOptions({stopWithApp: true});
      await TrackPlayer.reset();
      // !PlatformIOS && (await TrackPlayer.remove(num));
      await initiliazePlayer(false, allData[i - 1]);
    }
  };
  /**
   * The function `nextAudio` is an asynchronous function that handles the logic for playing the next
   * audio track in a playlist.
   **/
  const nextAudio = async i => {
    console.log('index numbert track', i);
    const num = await getCurrentTrackNumber();
    if (i < getLength - 1) {
      // await postDuration();
      console.log('if');
      setPlay(false);
      setAPIFirst(false);
      console.log(
        'getCurrentTrackNumbergetCurrentTrackNumbergetCurrentTrackNumbergetCurrentTrackNumber',
        num,
      );
      await TrackPlayer.updateOptions({stopWithApp: true});
      await TrackPlayer.reset();
      // PlatformIOS && !checkBG && (await TrackPlayer.destroy());
      // if (!PlatformIOS) {
      //   await TrackPlayer.remove(num);
      // }
      // await forHitAPIONPlaylist(allData[i]);
      setIndex(prev => prev + 1);
      setGetParamsData(() => allData[i + 1]);
      setData(allData[i + 1]);
      console.log('allDatakjbdvjksbdvkbsd', allData[i + 1]);
      await initiliazePlayer(false, allData[i + 1]);
      setPlay(true);
      await TrackPlayer.play();

      // setSound();
    } else if (i == getLength - 1 && checkParamsType && !loop) {
      navigation.goBack();
    } else if (i == getLength - 1 && checkParamsType) {
      // await postDuration();
      setPlay(false);
      setAPIFirst(false);
      await TrackPlayer.updateOptions({stopWithApp: true});
      await TrackPlayer.reset();
      // PlatformIOS && !checkBG && (await TrackPlayer.destroy());
      // !PlatformIOS && (await TrackPlayer.remove(num));
      setIndex(0);
      // await forHitAPIONPlaylist(allData[0]);
      setGetParamsData(() => allData[0]);
      setData(allData[0]);
      console.log('allDatakjbdvjksbdvkbsd', allData[0]);
      await initiliazePlayer(false, allData[0]);
      setPlay(true);
      await TrackPlayer.play();

      // setSound();
    } else {
      // play && (await postDuration());
      console.log('else');
      setPlay(false);
      setAPIFirst(false);
      await TrackPlayer.updateOptions({stopWithApp: true});
      await TrackPlayer.reset();
      // PlatformIOS && !checkBG && (await TrackPlayer.destroy());
      // !PlatformIOS && (await TrackPlayer.remove(num));
      setIndex(0);
      setGetParamsData(() => allData[0]);
      setData(allData[0]);
      await initiliazePlayer(false, allData[0]);

      // setSound();
    }
  };

  /**
   * The function `runOnLoop` toggles the value of a variable called `loop` using the `setloop`
   * function.
   **/
  const runOnLoop = async () => {
    setloop(prev => !prev);
  };

  //List of Playlist Modal
  const addPlaylistRef = useRef(null);
  const onAddOpen = () => {
    playlistRef.current?.close();
    addPlaylistRef.current?.open();
  };
  /**
   * The function `onAddClose` closes the `addPlaylistRef` if it exists.
   **/
  const onAddClose = () => addPlaylistRef.current?.close();
  /**
   * The `onCancel` function closes a playlist reference, opens another playlist reference, and then
   * refreshes the page after a 100ms delay.
   **/
  const onCancel = () => {
    addPlaylistRef.current?.close();
    playlistRef.current?.open();
    setTimeout(() => {
      onRefresh();
    }, 100);
  };

  // Form Submit Modal
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

  /** The above code is defining an arrow function that adds an event listener to the navigation object.
  The event listener is listening for the 'focus' event and when triggered, it calls the onRefresh()
  function and logs the value of the playlistData variable to the console. The event object is then
  returned. **/
  useEffect(() => {
    const event = navigation.addListener('focus', () => {
      onRefresh();
      console.log('playlistData', playlistData);
    });
    return event;
  }, [playlistData, playlist]);

  /** The above code is defining an arrow function that returns another arrow function. The inner arrow
  function checks if the value of `data.check_type` is not equal to `'lesson_content'` and the value
  of `playMinutesRef.current` is `false`. If this condition is true, it calls the `postDuration()`
  function. After that, it calls the `cancelDownloadFun()` function. **/
  useEffect(() => {
    return () => {
      if (
        data.check_type != 'lesson_content' &&
        playMinutesRef.current == false
      ) {
        postDuration();
      }
      cancelDownloadFun();
    };
  }, []);

  return {
    data: getParamsData,
    valuedata: data,
    modalizeRef,
    playlistRef,
    addPlaylistRef,
    errors,
    control,
    favoriteContentData,
    playlistData,
    onCancel,
    onIconOpen,
    onIconClose,
    onPlaylistOpen,
    onPlaylistClose,
    onAddOpen,
    onAddClose,
    onSubmit,
    handleSubmit,
    updateFavorite,
    startDownload,
    isDownload,
    isCompleted,
    progressVlaue: 0,
    cancelDownloadFun: () => {},
    imageDownload,
    onSlide,
    backwardAudio,
    forwardAudio,
    position,
    duration,
    currentAudioposition,
    setSound,
    play,
    checkParamsType,
    index,
    previousAudio,
    nextAudio,
    isSubscribed,
    runOnLoop,
    loop,
    isPlayAble,
    showEndScreen,
    postDuration,
  };
};

export default useMusicPlayer;
