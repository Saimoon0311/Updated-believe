import Types from '../saga-types';
import {call, put, takeLatest} from 'redux-saga/effects';
import * as OnBoardService from '../../services/onboard-service';
import {showError} from '../../services/SnackBar';
import {store} from '../store';

/** The `getAllGoalsSaga` function is a generator function that is used as a saga in Redux-Saga. It is
responsible for making an API call to the `OnBoardService.GoalsService` function and handling the
response. **/
function* getAllGoalsSaga() {
  const {ok, data, originalError} = yield call(OnBoardService.GoalsService);
  console.log(
    'datadatadatadatadatadatadatadatadatadatadatadatadatadatadata',
    ok,
    data,
  );
  if (ok) {
    const {goals} = data || {};
    yield put({
      type: Types.OnBoard_Update,
      payload: {goalData: goals},
    });
  } else {
    showError(originalError);
    console.log('errr =====>', ok, data, originalError);
  }
}

/** The `getAllFeelingsSaga` function is a generator function that is used as a saga in Redux-Saga. It
is responsible for making an API call to the `OnBoardService.FeelingsService` function and handling
the response. If the API call is successful (`ok` is true), it extracts the `feelings` data from the
response and dispatches an action to update the Redux store with the `feelingData`. If the API call
fails, it logs the error to the console. **/
function* getAllFeelingsSaga() {
  const {ok, data, originalError} = yield call(OnBoardService.FeelingsService);
  if (ok) {
    const {feelings} = data || {};
    yield put({
      type: Types.OnBoard_Update,
      payload: {feelingData: feelings},
    });
  } else {
    console.log(ok, data, originalError);
  }
}

/** The `getAllTracksSaga` function is a generator function that is used as a saga in Redux-Saga. It is
responsible for making an API call to the `OnBoardService.TrackService` function and handling the
response. If the API call is successful (`ok` is true), it extracts the `tracks`, `gender`, and
`age` data from the response and dispatches an action to update the Redux store with the
`trackData`, `genderData`, and `ageData`. If the API call fails, it logs the error to the console. **/
function* getAllTracksSaga() {
  const {ok, data, originalError} = yield call(OnBoardService.TrackService);
  if (ok) {
    const {tracks, gender, age} = data || {};
    yield put({
      type: Types.OnBoard_Update,
      payload: {trackData: tracks, genderData: gender, ageData: age},
    });
  } else {
    console.log(ok, data, originalError);
  }
}

/** The `getRecentlySearch` function is a generator function that is used as a saga in Redux-Saga. It is
responsible for making an API call to the `OnBoardService.RecentlySearch` function and handling the
response. If the API call is successful (`ok` is true), it extracts the `recently_searched` data
from the response and dispatches an action to update the Redux store with the `recentlySearch` data.
If the API call fails, it logs the error to the console. **/
function* getRecentlySearch() {
  const {ok, data, originalError} = yield call(OnBoardService.RecentlySearch);
  console.log('ok', ok);
  if (ok) {
    const {recently_searched} = data || {};
    yield put({
      type: Types.OnSearch_Update,
      payload: {recentlySearch: recently_searched},
    });
  } else {
    console.log(ok, data, originalError);
  }
}

/** The `getSuggestedData` function is a generator function that is used as a saga in Redux-Saga. It is
responsible for making an API call to the `OnBoardService.SuggestedSearch` function and handling the
response. If the API call is successful (`ok` is true), it extracts the `data` from the response and
dispatches an action to update the Redux store with the `suggestedSearch` data. If the API call
fails, it logs the error to the console. **/
function* getSuggestedData() {
  const {ok, data, originalError} = yield call(OnBoardService.SuggestedSearch);
  if (ok) {
    const arr = data || {};
    yield put({
      type: Types.OnSearch_Update,
      payload: {suggestedSearch: arr},
    });
  } else {
    console.log(ok, data, originalError);
  }
}

/** The `getSearch` function is a generator function that is used as a saga in Redux-Saga. It takes a
`param` parameter, which represents the payload of the action that triggered the saga. **/
function* getSearch(param) {
  console.log('params =>', param.payload);
  const {ok, data, originalError} = yield call(
    OnBoardService.Search,
    param.payload,
  );
  if (ok) {
    const {audios} = data || {};
    store.dispatch({
      type: Types.OnSearch_Update,
      payload: {searchingResult: audios},
    });
  } else {
    yield put({
      type: Types.OnSearch_Update,
      payload: {searchingResult: []},
    });
    console.log(ok, data, originalError);
  }
}

function* contentSaga() {
  yield takeLatest(Types.OnBoardGoals_Dispatch, getAllGoalsSaga);
  yield takeLatest(Types.OnBoardFeelings_Dispatch, getAllFeelingsSaga);
  yield takeLatest(Types.OnBoardTracks_Dispatch, getAllTracksSaga);

  yield takeLatest(Types.getRecentlySearch, getRecentlySearch);
  yield takeLatest(Types.getSuggestedKeyword, getSuggestedData);
  yield takeLatest(Types.searching, getSearch);
}

export default contentSaga;
