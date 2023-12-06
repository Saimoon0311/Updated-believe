import {useEffect, useState} from 'react';
import useReduxStore from '../../hooks/useReduxStore';
import {getValue, storeValue} from '../../services/storage';
import Purchases from 'react-native-purchases';
import {getUser, updateAuth} from '../../store/actions/auth-action';
import {Platform} from 'react-native';
import {
  believePackagsAndroidSKU,
  believePackagsIosSKU,
} from '../../utils/helper/LocalDb';
import {showError} from '../../services/SnackBar';
import {musicSwitch} from '../../utils/helper';

/**
 * The function `useSetThankyou` is a custom hook in JavaScript that handles navigation, restores
 * purchases, and performs other actions based on user subscription status and audio data.
 * @param navigation - The `navigation` parameter is an object that contains methods and properties
 * related to navigation in a React Native app. It is typically provided by a navigation library such
 * as React Navigation. The `navigation` object allows you to navigate between screens, pass parameters
 * to screens, and access the navigation state.
 * @returns The function `useSetThankyou` returns an object with the following properties:
 **/
const useSetThankyou = (navigation, {params}) => {
  const data = params;
  const [isExplore, setIsExplore] = useState(false);
  const {getState, dispatch} = useReduxStore();
  const {user} = getState('Auth');

  /**
   * The function `onRestore` is used to restore purchases and update the user's subscription status
   * based on the restored entitlements.
   **/
  const onRestore = async () => {
    updateAuth({loading: true});
    try {
      const restore = await Purchases.restorePurchases();
      if (restore.entitlements.active['AppStorePlans'] != undefined) {
        var platform =
          Platform.OS == 'ios'
            ? believePackagsIosSKU[0]
            : believePackagsAndroidSKU[0];
        var title =
          restore.entitlements.active['AppStorePlans'].productIdentifier ==
          platform
            ? 'Yearly'
            : 'Monthly';
        userData = {
          ...user,
          user_subscription: {
            change_possible: true,
            subscription_type: title,
          },
          is_subscribed: true,
        };
        storeValue('suscribe', 'true');
        dispatch(getUser());
        updateAuth({loading: false});
      }
      updateAuth({loading: false});
    } catch (e) {
      updateAuth({loading: false});
      console.log('e', e);
    }
  };

  // useEffect(onRestore, []);

  /**
   * The function `GoNext` checks the value of a variable and navigates to different screens based on the
   * value.
   **/
  const GoNext = () => {
    const subVal = getValue('suscribe');
    if (subVal == 'true') navigation.replace('MainTabScreen');
    else {
      setIsExplore(true);
      navigation.navigate('Subscription');
    }
  };

  /**
   * The onPlay function navigates to the MusicPlayer screen with the audio data and a flag indicating it
   * is part of a series.
   **/
  const onPlay = async () => {
    await musicSwitch(false);
    navigation.navigate('MusicPlayer', {...data?.audio, isSeries: true});
  };
  /** The `useEffect` hook is used to subscribe to the `focus` event of the navigation object. When the
screen is focused, the callback function is called. In this case, if the `isExplore` variable is
true, it navigates to the 'MainTabScreen' using the `navigation.replace` method. **/

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      if (isExplore) navigation.replace('MainTabScreen');
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [isExplore]);

  return {
    GoNext,
    onPlay,
    apidata: data,
    feelingData: data.names,
    goalingData: data.goalsName,
    user,
  };
};

export default useSetThankyou;
