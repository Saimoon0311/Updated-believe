import {useEffect, useState} from 'react';
import useReduxStore from '../../hooks/useReduxStore';
import {getHomeScreenContent} from '../../store/actions/content-action';
import API from '../../services/API';
import {getUser} from '../../store/actions/auth-action';
import {getCurrentTimeWithFormat, musicSwitch} from '../../utils/helper';
import NavigationService from '../../services/NavigationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPlayer from 'react-native-track-player';
import {getValue} from '../../services/storage';

/**
 * The `useHome` function is a custom hook in JavaScript that returns an object with various functions
 * and variables used in the Home screen of an application.
 * @returns The function `useHome` returns an object containing various functions and variables that
 * are used in the Home screen. These include `user`, `homeContent`, `reminders`, `onRefresh`,
 * `viewAll`, `viewGoals`, `viewSubscription`, `viewBadges`, `viewReminders`, `viewMeditation`,
 * `reminderDetail`, `libraryDetail`, `recentAchievements`,
 **/
const useHome = ({navigate, addListener}) => {
  /** Destructuring the useReduxStore hook, and then destructuring the getState function, which is
returned from the useReduxStore hook. **/
  const {getState, dispatch} = useReduxStore();
  const {user, isLogin} = getState('Auth');
  const {homeContent} = getState('Content');
  const [reminders, setReminders] = useState([]);

  /** The line `const isSubscript = Boolean(user?.is_subscribed);` is checking if the `is_subscribed`
  property of the `user` object is truthy or falsy. **/
  const isSubscript = Boolean(user?.is_subscribed);

  /**
   * It takes in a parameter called params, and then navigates to the ViewAll screen, passing in the
   * params
   **/
  const viewAll = params => navigate('ViewAll', params);

  /**
   * When the user clicks the button, navigate to the Goals screen.
   **/
  const viewGoals = () =>
    navigate('Goals', {
      title: 'Set Your Feelings',
      description: 'How would you like to feel today?',
      post: '/update-feelings',
      get: '/user-feelings',
    });

  /**
   * It navigates to the Subscription screen and passes the title Subscription as a parameter
   **/
  const viewSubscription = () =>
    navigate('Subscription', {title: 'Subscription'});

  /**
   * It navigates to the Badges screen.
   **/
  const viewBadges = () => navigate('Badges', {title: 'Badges'});

  /**
   * It navigates to the Reminders screen and passes in the params object
   **/
  const viewReminders = setReminder =>
    navigate('Reminders', {title: 'My Reminders', setReminder});

  /**
   * It navigates to the Settings screen and passes the title 'Meditation Setting' as a parameter.
   **/
  const viewMeditation = () => navigate('Settings');
  // navigate('Settings', {title: 'Mediation Setting'});

  /**
   * It takes a parameter called params, and then navigates to the ReminderDetail screen, passing in the
   * params
   **/
  const reminderDetail = params => navigate('ReminderDetail', params);

  /**
   * It takes a parameter called params, and then navigates to the LibraryDetails screen, passing in the
   * params
   **/
  const libraryDetail = params => navigate('LibraryDetails', params);

  /**
   * It takes a parameter called params, and then navigates to the MusicPlayer screen, passing in the
   * params
   **/
  const playAudio = async params => {
    console.log(
      'check on home the value of backgeround',
      await AsyncStorage.getItem('background'),
    );
    await musicSwitch(false);
    navigate('MusicPlayer', params);
  };

  /**
   * It dispatches an action to the redux store, which will then update the state of the app
   **/
  const onRefresh = async () => {
    const asyncDate = await AsyncStorage.getItem('sessionDatas');
    console.log('async storage data home data ', asyncDate);
    dispatch(getUser());
    dispatch(getHomeScreenContent());
    // is_subscribedCheckFun();
    await API.post('/update-streak', {
      current_date: getCurrentTimeWithFormat(),
    });
    const {ok, data} = await API.get('/user-reminder');
    if (ok) {
      setReminders(
        !data.reminders?.length
          ? [{title: 'Set a Reminder', id: 1}]
          : data?.reminders,
      );
    }
  };

  /**
   * The function "recentAchievements" navigates to the "Badges" page with a title of "Badges".
   **/
  const recentAchievements = () => navigate('Badges', {title: 'Badges'});
  /* A react hook that is used to perform side effects in function components. **/
  useEffect(() => {
    const event = addListener('focus', onRefresh);
    return event;
  }, []);
  /* Returning an object with all the functions and variables that are used in the Home screen. **/
  return {
    user,
    homeContent,
    reminders,
    onRefresh,
    viewAll,
    viewGoals,
    viewSubscription,
    viewBadges,
    viewReminders,
    viewMeditation,
    reminderDetail,
    libraryDetail,
    recentAchievements,
    playAudio,
    isSubscript,
  };
};

export default useHome;
