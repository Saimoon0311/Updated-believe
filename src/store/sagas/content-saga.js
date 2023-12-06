import Types from '../saga-types';
import {call, put, takeLatest, delay, select} from 'redux-saga/effects';
import ContentService from '../../services/content-service';
import {showError, showSuccess} from '../../services/SnackBar';
import {updateAuth} from '../actions/auth-action';
import {store} from '../store';

/** The above code is defining a generator function called `getAllHomeContentSaga`. **/
function* getAllHomeContentSaga() {
  const {ok, data, originalError} = yield call(ContentService.allHomeContent);
  if (ok) {
    yield put({type: Types.Content_Update, payload: {homeContent: data}});
  } else {
    console.log(ok, data, originalError);
  }
}

/** The above code is defining a generator function called `getAllLiveEventsSaga`. **/
function* getAllLiveEventsSaga() {
  const {ok, data, originalError} = yield call(ContentService.allLiveEvents);
  if (ok) {
    yield put({type: Types.Content_Update, payload: {liveEvents: data}});
  } else {
    console.log(ok, data, originalError);
  }
}

/** The above code is defining a generator function called getAllRemindersSaga. **/
function* getAllRemindersSaga() {
  const {ok, data, originalError} = yield call(ContentService.allReminders);
  if (ok) {
    const {reminders} = data || {};
    yield put({type: Types.Content_Update, payload: {allReminders: reminders}});
  } else {
    console.log(ok, data, originalError);
  }
}

/** The above code is defining a generator function called `getAllCategoryAndLibrariesSaga`. **/
function* getAllCategoryAndLibrariesSaga() {
  const {ok, data, originalError} = yield call(
    ContentService.allCategoryAndLibraries,
  );
  if (ok) {
    // console.log('{all_categories, all_libraries}', {data});
    const {all_categories, all_libraries} = data || {};
    yield put({
      type: Types.Content_Update,
      payload: {allCategories: all_categories, allLibraries: all_libraries},
    });
  } else {
    console.log(ok, data, originalError);
  }
}

/** The above code is defining a generator function called `getAllLibraryAudiosSaga` that takes in an
`action` parameter. **/
function* getAllLibraryAudiosSaga(action) {
  const {ok, data, originalError} = yield call(
    ContentService.allLibraryAudios,
    action.payload,
  );
  if (ok) {
    const {audios} = data || {};
    yield put({type: Types.Content_Update, payload: {allLibAudios: audios}});
  } else {
    console.log(ok, data, originalError);
  }
}

/** The above code is defining a generator function called `getAllContentLibrariesSaga` that takes in an
`action` parameter. **/
function* getAllContentLibrariesSaga(action) {
  const {ok, data, originalError} = yield call(
    ContentService.allContentLibraries,
    action.payload,
  );
  if (ok) {
    const {categories, request_url} = data || {};
    const contentLibraries = categories?.length ? categories : [];
    yield put({
      type: Types.Content_Update,
      payload: {
        contentLibraries,
        requestParam: request_url,
      },
    });
  } else {
    console.log(ok, data, originalError);
  }
}

/** The above code is defining a generator function called `getAllVideosSaga` that takes in an `action`
parameter. **/
function* getAllVideosSaga(action) {
  const {ok, data, originalError} = yield call(
    ContentService.allCategoryVideos,
    action.payload,
  );
  if (ok) {
    const {videos} = data || {};
    yield put({type: Types.Content_Update, payload: {allCatVideos: videos}});
  } else {
    console.log(ok, data, originalError);
  }
}

/** The above code is defining a generator function called `getAllScriptChaptersSaga` that takes an
`action` parameter. **/
function* getAllScriptChaptersSaga(action) {
  const {ok, data, originalError} = yield call(
    ContentService.allCategoryVideos,
    action.payload,
  );
  if (ok) {
    const {chapters} = data || {};
    yield put({
      type: Types.Content_Update,
      payload: {scriptChapters: chapters},
    });
  } else {
    console.log(ok, data, originalError);
  }
}

/** The above code is defining a generator function called `getAllCoursesSaga` that takes in an `action`
parameter. **/
function* getAllCoursesSaga(action) {
  const {ok, data, originalError} = yield call(
    ContentService.allCourses,
    action.payload,
  );
  if (ok) {
    const {categories} = data || {};
    yield put({type: Types.Content_Update, payload: {allCourses: categories}});
  } else {
    console.log(ok, data, originalError);
  }
}

/** The above code is defining a generator function called `getCourseLessons` that takes in an `action`
parameter. **/
function* getCourseLessons(action) {
  const {ok, data, originalError} = yield call(
    ContentService.allCourseLessons,
    action.payload,
  );
  if (ok) {
    const {lessons} = data || {};
    yield put({
      type: Types.Content_Update,
      payload: {allCourseLessons: lessons},
    });
  } else {
    console.log(ok, data, originalError);
  }
}

/** The above code is defining a generator function called `getScriptsSaga`. **/
function* getScriptsSaga() {
  const {ok, data, originalError} = yield call(ContentService.allScripts);
  if (ok) {
    const {categories, request_url} = data || {};
    yield put({
      type: Types.Content_Update,
      payload: {allScripts: categories, requestParam: request_url},
    });
  } else {
    console.log(ok, data, originalError);
  }
}

/** The above code is defining a generator function called `getSeriesSaga`. **/
function* getSeriesSaga() {
  const {ok, data, originalError} = yield call(ContentService.allSeries);
  if (ok) {
    const {categories, request_url} = data || {};
    yield put({
      type: Types.Content_Update,
      payload: {allSeries: categories, requestParam: request_url},
    });
  } else {
    console.log(ok, data, originalError);
  }
}

/** The above code is defining a generator function called `getEBooksSaga`. **/
function* getEBooksSaga() {
  const {ok, data, originalError} = yield call(ContentService.allEBooks);
  if (ok) {
    const {all_ebooks} = data || {};
    yield put({
      type: Types.Content_Update,
      payload: {allEBooks: all_ebooks},
    });
  } else {
    console.log(ok, data, originalError);
  }
}

/** The above code is defining a generator function called getAllRingtonesSaga. **/
function* getAllRingtonesSaga() {
  const {ok, data, originalError} = yield call(ContentService.allRingtones);
  if (ok) {
    const {all_ringtones} = data || {};
    yield put({
      type: Types.Content_Update,
      payload: {ringtones: all_ringtones},
    });
  } else {
    console.log(ok, data, originalError);
  }
}

/** The above code is defining a generator function called `getAllBackgroundSaga`. **/
function* getAllBackgroundSaga() {
  const {ok, data, originalError} = yield call(ContentService.allBackgrounds);
  if (ok) {
    const {all_meditation_backgrounds} = data || {};
    yield put({
      type: Types.Content_Update,
      payload: {backgrounds: all_meditation_backgrounds},
    });
  } else {
    console.log(ok, data, originalError);
  }
}

/** The above code is defining a generator function called `getAllReviewsSaga` that takes in an `action`
parameter. **/
function* getAllReviewsSaga(action) {
  // console.log('action.payload', action.payload);
  const {ok, data, originalError} = yield call(
    ContentService.allReviewsService,
    action.payload,
  );
  if (ok) {
    const {all_reviews} = data || {};
    yield put({
      type: Types.Content_Update,
      payload: {allReviews: all_reviews},
    });
  } else {
    console.log(ok, data, originalError);
  }
}

/** The above code is defining a generator function called `postReviewSaga` that takes in an `action`
parameter. **/
function* postReviewSaga(action) {
  console.log('postReviewSaga', action.payload);
  const {ok, data, originalError} = yield call(
    ContentService.postReviewService,
    action.payload,
  );
  if (ok) {
    showSuccess(data?.message);
  } else {
    console.log(ok, data, originalError);
  }
}

/** The above code is defining a generator function called `getFavoriteSaga`. **/
function* getFavoriteSaga() {
  const {ok, data, originalError} = yield call(ContentService.getFavorites);
  if (ok) {
    const {all_favorite_audios} = data || {};
    yield put({
      type: Types.Content_Update,
      payload: {allFavorites: all_favorite_audios},
    });
  } else {
    console.log(ok, data, originalError);
  }
}

/** The above code is defining a generator function called `toggleFavoriteSaga` that takes in an
`action` parameter. **/
function* toggleFavoriteSaga(action) {
  const {ok, data, originalError} = yield call(
    ContentService.toggleFavorite,
    action.payload,
  );
  if (ok) {
    const {
      Content: {allFavorites},
    } = yield select();
    yield put({
      type: Types.Content_Update,
      payload: {
        allFavorites: allFavorites.filter(
          item => item?.id != action.payload?.audio_id,
        ),
      },
    });
    showSuccess(data?.message);
  } else {
    console.log(ok, data, originalError);
  }
}

/** The above code is defining a generator function called `createPlaylistSaga` that takes in an
`action` parameter. **/
function* createPlaylistSaga(action) {
  // console.log('Create Playlist', action.payload);
  const {ok, data, originalError} = yield call(
    ContentService.createPlaylistService,
    action.payload,
  );
  if (ok) {
    const {
      Content: {playlistData},
    } = yield select();
    const {playlist} = data || {};
    yield put({
      type: Types.Content_Update,
      payload: {playlistData: [playlist, ...playlistData]},
    });
    showSuccess(data?.message);
  } else {
    console.log(ok, data, originalError);
    showError(data?.message ?? originalError);
  }
}

/** The above code is defining a generator function called `getPlaylistSaga`. **/
function* getPlaylistSaga() {
  console.log('Playlist Data');
  yield put(updateAuth({loading: true}));
  const {ok, data, originalError} = yield call(
    ContentService.getPlaylistService,
  );
  if (ok) {
    const {all_playlist} = data || {};
    yield put({
      type: Types.Content_Update,
      payload: {playlistData: all_playlist?.reverse()},
    });
    yield put(updateAuth({loading: false}));
  } else {
    console.log(ok, data, originalError);
    yield put(updateAuth({loading: false}));
  }
}

/** The above code is defining a generator function called `getPlaylistAudioSaga` that takes in an
`action` parameter. **/
function* getPlaylistAudioSaga(action) {
  const {ok, data, originalError} = yield call(
    ContentService.getPlaylistAudioService,
    action.payload,
  );
  if (ok) {
    const {audios, playlist} = data || {};
    const newData = audios?.map(item => ({
      ...item,
      artist: 'Victoria Gallagher',
    }));
    yield put({
      type: Types.Content_Update,
      payload: {playlistAudios: newData, playlist},
    });
  } else {
    console.log('asdas', ok, data, originalError);
  }
}
/** The above code is defining a generator function called `updatePlaylistAudioSaga` that takes in an
`action` parameter. **/
function* updatePlaylistAudioSaga(action) {
  const {playlistAudios, playlist} = action.payload;
  yield put({
    type: Types.Content_Update,
    payload: {playlistAudios, playlist},
  });
}

/** The above code is defining a generator function called `addToPlaylistSaga` that takes in an `action`
parameter. **/
function* addToPlaylistSaga(action) {
  console.log('Add to Playlist', action.payload);
  const {ok, data, originalError} = yield call(
    ContentService.addToPlaylistService,
    action.payload,
  );
  if (ok) {
    console.log('datadfghjkjhgfdxc', data);
    const {playlistAudios, playlist} = data || {};
    setTimeout(() => {
      store.dispatch({
        type: Types.Content_Update,
        payload: {playlistAudios, playlist},
      });
    }, 1000);

    showSuccess(data?.message);
  } else {
    console.log('onadd playlist', ok, data, originalError);
    showError(data?.message || 'Network request failed');
  }
}

/** The above code is defining a generator function called `removePlaylistAudioSaga` that takes in an
`action` parameter. **/
function* removePlaylistAudioSaga(action) {
  const {ok, data, originalError} = yield call(
    ContentService.removePlaylistAudioService,
    action.payload,
  );
  if (ok) {
    const {
      Content: {playlistAudios},
    } = yield select();
    yield put({
      type: Types.Content_Update,
      payload: {
        playlistAudios: playlistAudios.filter(
          item => item?.id != action.payload?.audio_id,
        ),
        playlist: data.playlist,
      },
    });
    showSuccess(data?.message);
  } else {
    console.log(ok, data, originalError);
  }
}

/** The above code is defining a generator function called `deletePlaylistSaga` that takes in an
`action` parameter. **/
function* deletePlaylistSaga(action) {
  console.log('Delete Playlist', action.payload);
  const {ok, data, originalError} = yield call(
    ContentService.deletePlaylistService,
    action.payload,
  );
  if (ok) {
    const {
      Content: {playlistData},
    } = yield select();
    yield put({
      type: Types.Content_Update,
      payload: {
        playlistData: playlistData.filter(
          item => item?.id != action.payload?.id,
        ),
      },
    });
    showSuccess(data?.message);
  } else {
    console.log(ok, data, originalError);
    showError(data?.message);
  }
}

/** The above code is defining a generator function called `editPlaylistSaga` that takes in an `action`
parameter. **/
function* editPlaylistSaga(action) {
  console.log('Edit Playlist', action.payload);
  const {ok, data, originalError} = yield call(
    ContentService.editPlaylistService,
    action.payload,
  );
  console.log('editPlaylistSaga', data);
  if (ok) {
    const {playlist} = data || {};
    yield put({
      type: Types.Content_Update,
      payload: {playlist},
    });
    showSuccess(data?.message);
  } else {
    console.log(ok, data, originalError);
  }
}

/** The above code is defining a generator function called `sendAudioViewCountSaga` that takes in an
`action` parameter. **/
function* sendAudioViewCountSaga(action) {
  console.log('Audio Count', action.payload);
  yield call(ContentService.adddAudioCountService, action.payload);
}
/** The above code is defining a generator function called `appStreakSaga`. **/
function* appStreakSaga() {
  console.log('appStreakSaga===================>>>>>>>>>>>');
  yield call(ContentService.appStreak);
}

/** The above code is defining a generator function called `contentSaga`. **/
function* contentSaga() {
  yield takeLatest(Types.HomeContent_Dispatch, getAllHomeContentSaga);
  yield takeLatest(Types.AllEvents_Dispatch, getAllLiveEventsSaga);
  yield takeLatest(Types.AllReminders_Dispatch, getAllRemindersSaga);
  yield takeLatest(
    Types.AllCategoryAndLibraries_Dispatch,
    getAllCategoryAndLibrariesSaga,
  );
  yield takeLatest(Types.AllLibraryAudios_Dispatch, getAllLibraryAudiosSaga);
  yield takeLatest(Types.ContentLibraries_Dispatch, getAllContentLibrariesSaga);
  yield takeLatest(Types.AllCategoryVideos_Dispatch, getAllVideosSaga);
  yield takeLatest(Types.AllScripts_Dispatch, getScriptsSaga);
  yield takeLatest(Types.AllScriptChapter_Dispatch, getAllScriptChaptersSaga);
  yield takeLatest(Types.AllSeries_Dispatch, getSeriesSaga);
  yield takeLatest(Types.AllEBooks_Dispatch, getEBooksSaga);
  yield takeLatest(Types.AllCourses_Dispatch, getAllCoursesSaga);
  yield takeLatest(Types.AllRingtones_Dispatch, getAllRingtonesSaga);
  yield takeLatest(Types.AllBackground_Dispatch, getAllBackgroundSaga);
  yield takeLatest(Types.AllReviews_Dispatch, getAllReviewsSaga);
  yield takeLatest(Types.PostReview_Dispatch, postReviewSaga);
  yield takeLatest(Types.AllCourseLessons_Dispatch, getCourseLessons);
  yield takeLatest(Types.GetFavorite_Dispatch, getFavoriteSaga);
  yield takeLatest(Types.ToggleFavorite_Dispatch, toggleFavoriteSaga);
  yield takeLatest(Types.CreatePlaylist_Dispatch, createPlaylistSaga);
  yield takeLatest(Types.GetPlaylist_Dispatch, getPlaylistSaga);
  yield takeLatest(Types.GetPlaylistAudio_Dispatch, getPlaylistAudioSaga);
  yield takeLatest(Types.updatePlaylistAudio_Dispatch, updatePlaylistAudioSaga);
  yield takeLatest(Types.AddToPlaylist_Dispatch, addToPlaylistSaga);
  yield takeLatest(Types.RemoveFromPlaylist_Dispatch, removePlaylistAudioSaga);
  yield takeLatest(Types.DeletePlaylist_Dispatch, deletePlaylistSaga);
  yield takeLatest(Types.EditPlaylist_Dispatch, editPlaylistSaga);
  yield takeLatest(Types.SendAudioCount_Dispatch, sendAudioViewCountSaga);
  yield takeLatest(Types.AppStreaks_Dispatch, appStreakSaga);
}

export default contentSaga;
