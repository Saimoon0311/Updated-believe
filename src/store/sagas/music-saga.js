import Types from '../saga-types';
import {call, put, takeLatest} from 'redux-saga/effects';
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
} from 'react-native-track-player';
import {backgroundImage} from '../../Assets/Images';

export const audioFile = {
  url: require('../../Assets/tracks/Serenity.mp3'),
  title: 'Believe',
  artist: 'Victoria Gallagher',
  artwork: backgroundImage,
  // artwork: 'https://react-native-track-player.js.org/example/Longing.jpeg',
};

/** The `addMusicSaga` function is a generator function that is used as a saga in a Redux-Saga
middleware. It takes a `param` parameter as input. **/
function* addMusicSaga(param) {
  const {appMusic} = param?.payload;
  if (appMusic) {
    // const track = yield call(TrackPlayer.getActiveTrack);
    // console.log('track ===>', track);
    yield call(TrackPlayer.setRepeatMode, RepeatMode.Track);
    yield call(TrackPlayer.updateOptions, {
      stopWithApp: true,
      // android: {
      //   // This is the default behavior
      //   appKilledPlaybackBehavior:
      //     AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      // },
      capabilities: [Capability.Play, Capability.Pause, Capability.Stop],
      compactCapabilities: [Capability.Play, Capability.Pause, Capability.Stop],
    });
    yield call(TrackPlayer.add, audioFile);
    yield call(TrackPlayer.play);
    return;
  } else {
    yield call(TrackPlayer.reset);
  }
  yield put({type: Types.Auth_Update, payload: {appMusic: true}});
}
/** The `removeMusicSaga` function is a generator function that is used as a saga in a Redux-Saga
middleware. It takes a `param` parameter as input. **/
function* removeMusicSaga(param) {
  const {appMusic} = param?.payload;
  yield call(TrackPlayer.remove);
  const track = yield call(TrackPlayer.getCurrentTrack);
  if (track == null) {
    yield call(TrackPlayer.setupPlayer);
    yield call(TrackPlayer.updateOptions, {
      stopWithApp: false,
      capabilities: [Capability.Play, Capability.Pause, Capability.Stop],
      compactCapabilities: [Capability.Play, Capability.Pause, Capability.Stop],
    });
  }
  yield call(TrackPlayer.add, audioFile);
  if (appMusic) yield call(TrackPlayer.play);
  yield put({type: Types.Auth_Update, payload: {appMusic}});
}
/** The `toggleMusicSaga` function is a generator function that is used as a saga in a Redux-Saga
middleware. It takes an `action` parameter as input. **/
function* toggleMusicSaga(action) {
  const {play} = action?.payload;
  if (play) TrackPlayer.pause();
  else TrackPlayer.play();
}

/** The `function* musicSaga() {` is defining a generator function named `musicSaga`. This function is
used as a saga in a Redux-Saga middleware. It uses the `takeLatest` effect from Redux-Saga to listen
for specific actions and then call the corresponding saga function. **/
function* musicSaga() {
  yield takeLatest(Types.addAudio_Dispatch, addMusicSaga);
  yield takeLatest(Types.removeAudio_Dispatch, removeMusicSaga);
  yield takeLatest(Types.toggleAudio_Dispatch, toggleMusicSaga);
}

export default musicSaga;
