import useReduxStore from '../../hooks/useReduxStore';
import {
  getUser,
  logOutUser,
  updateAuth,
  updateSub,
} from '../../store/actions/auth-action';
import InAppReview from 'react-native-in-app-review';
import {Alert, Linking, Platform} from 'react-native';
import cache from '../../utils/helper/cache';
import {deleteAllFiles} from '../../services/DownloadServices';
import {showError, showSuccess} from '../../services/SnackBar';
import {useEffect, useState} from 'react';
import Purchases from 'react-native-purchases';
import {
  believePackagsAndroidSKU,
  believePackagsIosSKU,
} from '../../utils/helper/LocalDb';
import {storeValue} from '../../services/storage';
import API from '../../services/API';
import {onShareFromApp} from '../../utils/helper';

/**
 * The function `triggerReview` checks if the InAppReview feature is available, and if so, triggers the
 * UI for the in-app review process and logs the result.
 * @returns The function `triggerReview` does not explicitly return anything.
 **/
export const triggerReview = () => {
  if (!InAppReview.isAvailable) return;

  // trigger UI InAppreview
  InAppReview.RequestInAppReview()
    .then(hasFlowFinishedSuccessfully => {
      // when return true in android it means user finished or close review flow
      console.log('InAppReview in android', hasFlowFinishedSuccessfully);

      // when return true in ios it means review flow lanuched to user.
      console.log(
        'InAppReview in ios has launched successfully',
        hasFlowFinishedSuccessfully,
      );

      // 1- you have option to do something ex: (navigate Home page) (in android).
      // 2- you have option to do something,
      // ex: (save date today to lanuch InAppReview after 15 days) (in android and ios).

      // 3- another option:
      if (hasFlowFinishedSuccessfully) {
        setTimeout(() => {
          onShareFromApp(
            Platform.OS == 'ios' ? 'AppStoreReviewer' : 'InAppReviewer',
          );
        }, 2000);

        console.log('DONe');
        // do something for ios
        // do something for android
      }

      // for android:
      // The flow has finished. The API does not indicate whether the user
      // reviewed or not, or even whether the review dialog was shown. Thus, no
      // matter the result, we continue our app flow.

      // for ios
      // the flow lanuched successfully, The API does not indicate whether the user
      // reviewed or not, or he/she closed flow yet as android, Thus, no
      // matter the result, we continue our app flow.
    })
    .catch(error => {
      //we continue our app flow.
      // we have some error could happen while lanuching InAppReview,
      // Check table for errors and code number that can return in catch.
      console.log('sdfsdfsdfsfs', error);
      showSuccess(error ?? 'some error from the store');
    });
};

/**
 * The `useMe` function is a custom hook that provides various functionalities related to user
 * authentication and data manipulation, such as logging out, deleting downloaded content, restoring
 * purchases, and refreshing user data.
 * @returns The `useMe` function is returning an object with the following properties:
 **/
const useMe = ({navigate, addListener}) => {
  /** The line `const {getState, dispatch} = useReduxStore();` is using the `useReduxStore` hook to get
  the `getState` and `dispatch` functions from the Redux store. **/
  const {getState, dispatch} = useReduxStore();

  /** The line `const user2 = getState('Auth');` is retrieving the user data from the Redux store. It is
  using the `getState` function from the `useReduxStore` hook to get the state of the 'Auth' slice
  of the Redux store. The 'Auth' slice likely contains information about the authenticated user,
  such as their name, email, and subscription status. The `user2` variable is then used in other
  parts of the code to access and manipulate the user data. **/
  const user2 = getState('Auth');

  console.log('user2user2user2user2user2user2', user2);

  /**
   * The logOutHandler function logs out the user, updates the 'subscribe' value to 'false', and
   * dispatches the logOutUser action.
   **/
  const logOutHandler = async () => {
    await API.get('/logout');
    storeValue('suscribe', 'false');
    dispatch(logOutUser());
  };
  const [audioPath, setAudioPath] = useState([]);
  const [imagePath, setImagePath] = useState([]);

  /**
   * The showAlert function displays an alert dialog asking the user if they want to delete all
   * downloaded content, and performs the deletion if the user chooses to proceed.
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
   * The function `deleteDownloads` deletes all downloaded files and displays a success message if
   * successful, or an error message if no downloads are found.
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
        !type && showSuccess('All download file has been deleted');
      } else !type && showError('No downloads found!');
    } catch (error) {
      console.log('25', error);
    }
  };

  /**
   * The function `onRefresh` dispatches a `getUser` action.
   **/
  const onRefresh = () => dispatch(getUser());

  /** The `useEffect` hook is used to perform side effects in a functional component. In this case, the
`useEffect` hook is being used to add an event listener to the component when it is focused. **/
  useEffect(() => {
    const event = addListener('focus', () => onRefresh());
    return event;
  }, []);

  /**
   * The function "onRestore" is an asynchronous function.
   **/
  const onRestore = async () => {
    updateAuth({loading: true});
    console.log('djsbjkbdsjkvbdjksbvjkbdsbdsjvds', user2);
    try {
      const restore = await Purchases.restorePurchases();
      console.log(
        "restore.entitlements.active['AppStorePlsdasdasdasans']restore.entitlements.active['AppStorePlans']restore.entitlements.active['AppStorePlans']",
        restore.entitlements.active['AppStorePlans'],
      );

      /** The condition `if (restore.entitlements.active['AppStorePlans'] != undefined)` is checking if
      the 'AppStorePlans' entitlement is active in the restored purchases. **/
      if (restore.entitlements.active['AppStorePlans'] != undefined) {
        console.log('skjdbjbsdjkcbsdkjbcskjdb');
        var platform =
          Platform.OS == 'ios'
            ? believePackagsIosSKU[0]
            : believePackagsAndroidSKU[0];
        var title =
          restore.entitlements.active['AppStorePlans'].productIdentifier ==
          platform
            ? 'Yearly'
            : 'Monthly';

        const {data} = await API.post('/set-restore-identifier', {
          identifier:
            restore.entitlements.active['AppStorePlans'].productIdentifier,
          rev_id: restore.originalAppUserId,
        });

        userData = {
          ...user2.user,
          user_subscription: {
            change_possible: true,
            subscription_type: title,
          },
          subscribed: true,
          is_subscribed: true,
          store: restore.entitlements.active['AppStorePlans'].store,
          identifer:
            restore.entitlements.active['AppStorePlans'].productIdentifier,
        };
        let user = {...user2, ...userData};
        storeValue('suscribe', 'true');
        /** The line `dispatch(updateAuth({user}));` is dispatching an action to update the
        authentication state in the Redux store. **/

        dispatch(updateAuth({user}));
        updateAuth({loading: false});
      }
    } catch (e) {
      showError('failed to fatech data');
      updateAuth({loading: false});
      console.log('e', e);
    }
  };

  /**
   * The function `restorePurchase` displays an alert asking the user if they want to restore their
   * purchase, and if the user confirms, it updates the authentication state and calls the `onRestore`
   * function.
   **/
  const restorePurchase = () => {
    Alert.alert('Warning', 'Are you sure you want to restore your purchase?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          updateAuth({loading: true});
          await onRestore();
        },
      },
    ]);
  };

  // const helpRoute = async () => {
  //   try {
  //     await Linking.openURL('mailto:orders@hyptalk.com');
  //     console.log('success');
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };

  const helpRoute = () => {
    {
      Platform.OS === 'ios'
        ? Linking.openURL(
            'mailto:orders@hyptalk.com?subject=Help%20and%20Support%20-%20Believe%20App',
          )
            .then(() => console.log('Mail client opened successfully'))
            .catch(err => console.error('Error opening mail client:', err))
        : Linking.openURL(
            'mailto:orders@hyptalk.com?subject=Help and Support - Believe App',
          )
            .then(() => console.log('Mail client opened successfully'))
            .catch(err => console.error('Error opening mail client:', err));
    }
  };

  return {
    user: user2,
    logOutHandler,
    helpRoute,
    triggerReview,
    deleteDownloads: showAlert,
    restorePurchase,
    onRefresh,
  };
};

export default useMe;
