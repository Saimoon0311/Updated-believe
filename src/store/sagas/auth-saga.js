import {call, put, takeLatest, delay} from 'redux-saga/effects';
import AuthService from '../../services/auth-service';
import {
  getToken,
  hasKey,
  removeToken,
  storeToken,
  storeValue,
} from '../../services/storage';
import {updateAuth} from '../actions/auth-action';
import {showError, showSuccess} from '../../services/SnackBar';
import Types from '../saga-types';
import SplashScreen from 'react-native-splash-screen';
import SocialLogin from '../../services/SocialLogin';
import auth from '@react-native-firebase/auth';
import {statusCodes} from '@react-native-google-signin/google-signin';
import NavigationService from '../../services/NavigationService';
import {
  getDataRenewCat,
  getFbResult,
  loginUser,
  registerUser,
  resetUserEmail,
  setAttributeRev,
  signInWithFirebase,
} from '../../utils/helper';
import cache from '../../utils/helper/cache';
import Purchases from 'react-native-purchases';
import {store} from '../store';
import {
  allSubID,
  believePackagsAndroidSKU,
  believePackagsIosSKU,
  believePackagsSKU,
  believePackagsStripeSKU,
} from '../../utils/helper/LocalDb';
import {Platform} from 'react-native';
// import API from '@/services/API';
import OneSignal from 'react-native-onesignal';
import {firebase} from '@react-native-firebase/analytics';

const handleNewUser = ({audio, params}) => {
  NavigationService.navigate('Subscription', {
    audio,
    ...params,
    isSignUp: true,
  });
};

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

/** This function is used to add the fcm token to the database. **/
function* fcmTokenSaga(action) {
  yield call(AuthService.fcmTokenAdd, action.payload);
}

/** This is a generator function which is used to login the user. **/
function* loginSaga(action) {
  try {
    yield put(updateAuth({loading: true}));
    yield call(loginUser, action.payload);
    const idTokenResult = yield call(getFbResult);
    const jwtToken = idTokenResult.token;
    console.log(jwtToken, 'aklsdfjakljsdflkajsdkfl');
    if (jwtToken) {
      const {ok, data} = yield call(AuthService.firebaseLogin, {
        token: jwtToken,
      });
      if (ok) {
        const {detail, token} = data;
        storeToken('USER/TOKEN', token);
        cache.store('/verify', detail);
        yield put(updateAuth({user: detail, isLogin: true, token}));
        showSuccess(data?.message);
        firebase.analytics().logLogin({method: 'com.email'});
        // yield call(analytics().logLogin, {method: 'com.email'});
      } else {
        console.log('login error rororr ororroelelelelelelele', data);
        showError(data?.message);
      }
    }
  } catch (error) {
    console.log('login error rororr ororro', error);
    showError(error.message.split(' ').slice(1).join(' '));
  } finally {
    yield put(updateAuth({loading: false}));
  }
}

/** This is a generator function which is used to signup the user. **/
function* signUpSaga(action) {
  try {
    yield put(updateAuth({loading: true}));
    yield call(registerUser, action.payload);
    const idTokenResult = yield call(getFbResult);
    const jwtToken = idTokenResult.token;
    const {params, name} = action.payload;
    if (jwtToken) {
      const {ok, data} = yield call(AuthService.firebaseSignUp, {
        token: jwtToken,
        name,
        timezone,
        age: params?.age?.name,
        usergoal_ids: params?.goals,
        gender: params?.gender?.name,
        userfeeling_ids: params?.feeling,
        platform: Platform.OS,
      });
      console.log('dadtadtadtda', data, params);
      if (ok) {
        const {detail, token, audio} = data;
        yield put(updateAuth({user: detail, isLogin: true, token}));
        storeToken('USER/TOKEN', token);
        cache.store('/verify', detail);
        yield call(handleNewUser, {params, audio});
        // yield call(firebase.analytics().logLogin, {method: 'com.email'});
        firebase.analytics().logLogin({method: 'com.email'});

        showSuccess(data?.message);
      } else {
        console.log(
          'jkdb vjbvjsdbvjksdbvjsdbvjksdbvjksdbvjksdbvjsdbvjsd',
          data,
        );
        showError(data?.message);
      }
    }
  } catch (error) {
    console.log(
      'kjsdbcjksbd vjksasdasdasdasdfsdfsdfsdfsdfsdfsdfsdfsdasddbvjsvd',
      error,
    );
    showError(error.message.split(' ').slice(1).join(' '));
  } finally {
    yield put(updateAuth({loading: false}));
  }
}

/**
 * It signs the user out of the app
 **/
const authLogout = () => auth().signOut();

/** A generator function which is used to logout the user. **/
function* logOutSaga() {
  try {
    const downloads = cache.get('downloadedFiles') || [];
    yield call(removeToken);
    yield put({type: Types.LogOut});
    yield call(authLogout);
    cache.store('downloadedFiles', []);
  } catch (error) {
    console.log('ererere', error);
  }
}

/** This function is used to verify the user. **/
function* verifyUserSaga() {
  try {
    setTimeout(() => SplashScreen.hide(), 100);
    // yield put(updateAuth({showAnimatedSplash: true}));
    if (hasKey('background') == false) storeValue('background', 'true');
    const token = yield call(getToken) || {};
    const {Auth} = store.getState();
    console.log('token verifyUserSaga', token, Auth);
    if (token) {
      yield put(updateAuth({token}));
      const {ok, data} = yield call(AuthService.verifyUser);
      yield call(AuthService.updateStreak);
      if (ok) yield put(updateAuth({user: data, isLogin: true}));
    }
  } catch (error) {
    showError(error.message.split(' ').slice(1).join(' '));
  } finally {
    setTimeout(() => SplashScreen.hide(), 100);
  }
}

/** This function is used to reset the user password. **/
function* forgotUserSaga(action) {
  try {
    yield put(updateAuth({loading: true}));
    yield call(resetUserEmail, action.payload);
    showSuccess('Password Reset Request has been sent to your mail');
    NavigationService.navigate('Login');
  } catch (error) {
    showError(error.message.split(' ').slice(1).join(' '));
  } finally {
    yield put(updateAuth({loading: false}));
  }
}

/** This function is used to verify the user. **/
function* verificationSaga(action) {
  const {ok, data, originalError} = yield call(
    AuthService.verification,
    action.payload,
  );
  if (ok) {
    yield put(updateAuth({verification: true, verifyToken: data?.token}));
    showSuccess(data?.message);
    yield put(updateAuth({verification: false}));
  } else {
    const message = data?.message || originalError?.message;
    showError(message);
  }
}

/** This function is used to update the user profile. **/
function* updateProfileSaga(action) {
  const {ok, data, originalError} = yield call(
    AuthService.updateProfileService,
    action.payload,
  );
  if (ok) {
    const {user} = data;
    yield put(updateAuth({update: true, user}));
    showSuccess(data?.message);
  } else {
    const message = data?.message || originalError?.message;
    showError(message);
  }
}

/** This function is used to update the user subscription. **/
function* updateSubSaga(action) {
  const {payload} = action;
  yield put(updateAuth({user: payload, loading: true}));
  yield put(updateAuth({loading: false}));
  console.log('sga =========>>>>>>>>>>>>', payload);
}

/** This function is used to update the user password. **/
function* updatePasswordSaga(action) {
  const {ok, data, originalError} = yield call(
    AuthService.updatePassword,
    action.payload,
  );
  if (ok) {
    yield put(updateAuth({update: true, verifyToken: ''}));
    showSuccess(data?.message);
    delay(1000);
    yield put(updateAuth({update: false}));
  } else {
    const message = data?.message || originalError?.message;
    showError(message);
  }
}

/** This function is used to login the user with the social media. **/
function* socialLoginSaga({payload}) {
  try {
    const {provider, params} = payload;
    console.log('pyload', payload);
    const response = yield call(SocialLogin[`logInWith${provider?.name}`]);
    console.log('resposnsasdasdasdasdasdasdadasde', response);
    yield put(updateAuth({loading: true}));
    yield call(
      signInWithFirebase,
      provider?.name == 'apple' ? response.token : response,
    );
    const idTokenResult = yield call(getFbResult);
    const jwtToken = idTokenResult.token;
    if (jwtToken) {
      const endPoints = params
        ? AuthService.firebaseSignUp
        : AuthService.firebaseLogin;

      const {ok, data} = yield call(endPoints, {
        token: jwtToken,
        // name: 'default name ',
        name: response?.name || '',
        timezone,
        age: params?.age?.name,
        usergoal_ids: params?.goals,
        gender: params?.gender?.name,
        userfeeling_ids: params?.feeling,
        platform: Platform.OS,
      });
      if (ok) {
        const {detail, token, audio} = data;

        console.log('datadatadatadatadatadatadatadatadatadatadata', data);
        yield put(updateAuth({user: detail, isLogin: true, token}));
        storeToken('USER/TOKEN', token);
        cache.store('/verify', detail);
        console.log('data after updated', detail);
        if (params) yield call(handleNewUser, {params, audio});
        // yield call(firebase.analytics().logLogin, {
        //   method: `${provider?.name}+.com`,
        // });
        firebase.analytics().logLogin({method: `${provider?.name}.com`});

        showSuccess('You are now logged in');
      } else {
        console.log('kjsdbcjksbdddddd sdfsdfsdfsdfsdfsdfvjksdbvjsvd', data);
        showError(data?.message);
      }
    }
  } catch (error) {
    switch (error?.code || error?.message) {
      case statusCodes.SIGN_IN_CANCELLED:
      case '1001':
        showError('Cancelled');
        break;
      case statusCodes.IN_PROGRESS:
        console.log('In progress');
        break;
      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        showError('Play services not available or outdated');
        break;
      default:
        showError(error?.message || 'Something went wrong');
        break;
    }
  } finally {
    yield put(updateAuth({loading: false}));
  }
}

const getUserData = async () => {
  return await Purchases.getCustomerInfo();
};
/**
 * The function `getUserSaga` is an asynchronous function that retrieves user data, verifies the user,
 * and updates the user's subscription status based on the retrieved data.
 **/

const getUserSaga = async () => {
  let user = {};
  try {
    const getData = await getUserData();
    const {Auth} = store.getState();
    console.log('AuthAuthAuthAuthAuth', Auth);
    const {data} = await AuthService.verifyUser();

    console.log(
      'datadatadatadatadatadatadatadatadatadatadatadatadatadatadata',
      data,
    );
    let keyValue = data?.store?.toLowerCase();
    if (data.revenuecat_customer_id != null) {
      if (data.life_time == 'true') {
        user = {
          ...data,
          subscribed: true,
          is_subscribed: true,
        };
        storeValue('suscribe', 'true');
        store.dispatch(updateAuth({user}));
        OneSignal.sendTag('status', 'paid');
        console.log('data', user);
      } else if (keyValue == 'stripe') {
        var title =
          believePackagsStripeSKU[0] == data.identifer ? 'Yearly' : 'Monthly';
        console.log('titletitletitletitletitletitle', title);
        user = {
          ...data,
          user_subscription: {
            change_possible: true,
            subscription_type: title,
          },
          subscribed: true,
          is_subscribed: true,
          store: data.store,
          identifer: data.identifer,
        };
        storeValue('suscribe', 'true');
        OneSignal.sendTag('status', 'paid');
        store.dispatch(updateAuth({user}));
      } else if (data.identifer != null) {
        var title = allSubID[data.identifer];
        user = {
          ...data,
          user_subscription: {
            change_possible: true,
            subscription_type: title,
          },
          subscribed: true,
          is_subscribed: true,
        };
        storeValue('suscribe', 'true');
        setAttributeRev(user);
        OneSignal.sendTag('status', 'paid');
        store.dispatch(updateAuth({user}));
      } else {
        if (getData.entitlements.active['AppStorePlans'] != undefined) {
          await AuthService.getPro({pro_sub: true});
          // var platform =
          //   Platform.OS == 'ios'
          //     ? believePackagsIosSKU[0]
          //     : believePackagsAndroidSKU[0];
          var title =
            allSubID[
              getData.entitlements.active['AppStorePlans'].productIdentifier
            ];

          console.log(
            'if',
            getData.entitlements.active['AppStorePlans'],
            title,
          );
          user = {
            ...data,
            user_subscription: {
              change_possible: true,
              subscription_type: title,
            },
            subscribed: true,
            is_subscribed: true,
            store: getData.entitlements.active['AppStorePlans'].store,
            identifer:
              getData.entitlements.active['AppStorePlans'].productIdentifier,
          };
          storeValue('suscribe', 'true');
          OneSignal.sendTag('status', 'paid');
          setAttributeRev(user);
          store.dispatch(updateAuth({user}));
        } else {
          console.log('else', getData.entitlements);
          if (data.name) {
            user = {
              ...data,
              user_subscription: {
                change_possible: true,
                subscription_type: 'Free',
              },
              subscribed: false,
              is_subscribed: false,
            };
            storeValue('suscribe', 'false');
            setAttributeRev(user);
          }
          OneSignal.sendTag('status', 'free');
          console.log('cecoign vf ', user);
          store.dispatch(updateAuth({user}));
        }
      }
    } else {
      storeValue('suscribe', JSON.stringify(data.is_subscribed));
      store.dispatch(
        updateAuth({user: {...data, subscribed: data.is_subscribed}}),
      );
      OneSignal.sendTag('status', data.is_subscribed ? 'paid' : 'free');
    }
  } catch (error) {
    console.log('errrprr', error);
    // showError('Some thing went wrong');
  }
};

/** A generator function which is used to listen to the actions. **/
function* authSaga() {
  yield takeLatest(Types.Login_Dispatch, loginSaga);
  yield takeLatest(Types.SignUp_Dispatch, signUpSaga);
  yield takeLatest(Types.LogOut_Dispatch, logOutSaga);
  yield takeLatest(Types.Verify_Dispatch, verifyUserSaga);
  yield takeLatest(Types.Forgot_Dispatch, forgotUserSaga);
  yield takeLatest(Types.Verification_Dispatch, verificationSaga);
  yield takeLatest(Types.Update_Dispatch, updatePasswordSaga);
  yield takeLatest(Types.SocialLogin_Dispatch, socialLoginSaga);
  yield takeLatest(Types.UpdateProfile_Dispatch, updateProfileSaga);
  yield takeLatest(Types.FCMToken_Dispatch, fcmTokenSaga);
  yield takeLatest(Types.getUser_Dispatch, getUserSaga);
  yield takeLatest(Types.updateSubUser_Dispatch, updateSubSaga);
}

export default authSaga;
