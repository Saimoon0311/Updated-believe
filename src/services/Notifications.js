import {Alert, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, {
  EventType,
  AndroidLaunchActivityFlag,
} from '@notifee/react-native';
import {requestNotifications, openSettings} from 'react-native-permissions';
import NavigationService from './NavigationService';

const sound = Platform.select({
  ios: '/src/Assets/tracks/notificationAudio.wav',
  android: '/src/Assets/tracks/notificationAudio.mp3',
});
/**
 * The function `onNotificationNotiFee` handles the display of a notification and navigates to a
 * specific screen if certain conditions are met.
 * @param data - The `data` parameter is an object that contains the notification data. It typically
 * includes properties such as the title, body, and other custom data associated with the notification.
 * @param appState - The `appState` parameter represents the current state of the application. It can
 * have one of the following values:
 **/
const onNotificationNotiFee = async (data, appState) => {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    sound,
  });

  notifee.registerForegroundService.stop(channelId);

  // Display a notification
  notifee.displayNotification({
    ...data.notification,
    android: {
      channelId,
      ...data.notification.android,
      pressAction: {
        id: 'default',
        launchActivity: 'default',
        launchActivityFlags: [AndroidLaunchActivityFlag.SINGLE_TOP],
      },
      sound,
      asForegroundService: false,
    },
    ios: {sound},
  });
  const isActive = Boolean(NavigationService.ref && appState == 'active');
  const notificationObj = JSON.parse(data.data.payload);
  const getNameFunc = NavigationService.getCurrentRoute();
  const routeName = getNameFunc?.getCurrentRoute()?.name;
  if (
    isActive &&
    notificationObj?.notification_type == 'badge_unlocked' &&
    routeName != 'MusicPlayer'
  ) {
    NavigationService.navigate('Congratulations', notificationObj || {});
  }
};

class FCMService {
  /** The `register` function is a method of the `FCMService` class@. It takes three parameters:
`onRegister`, `onOpenNotification`, and `appState`. **/
  register = (onRegister, onOpenNotification, appState) => {
    this.checkPermission(onRegister);
    this.createNoitificationListeners(onRegister, onOpenNotification, appState);
  };

  /** The `checkPermission` function is responsible for checking if the app has permission to receive push
notifications. **/
  checkPermission = async onRegister => {
    try {
      const authStatus = await messaging().hasPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) this.getToken(onRegister);
      else if (!enabled && Platform.OS == 'ios')
        this.requestPermission(onRegister);
    } catch (error) {
      console.log(error);
    }
  };

  /** The `getToken` function is responsible for retrieving the device token used for push notifications.
It takes a callback function `onRegister` as a parameter, which is called with the token as an
argument. **/
  getToken = onRegister =>
    messaging()
      .getToken()
      .then(res => onRegister(res));

  requestPermission = async onRegister => {
    try {
      const {status} = await requestNotifications(['alert', 'sound', 'badge']);
      if (status === 'granted') this.getToken(onRegister);
      else {
        Alert.alert(
          'Warning',
          `Push notifications have been ${status}. You will not receive any important notification unless enabled from settings.`,
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'Open Setting',
              onPress: () => {
                openSettings().catch(() =>
                  console.warn('Cannot open settings'),
                );
              },
            },
          ],
          {
            userInterfaceStyle: 'light',
          },
        );
      }
    } catch (error) {
      console.log('Requested persmission rejected ', error);
    }
  };

  /** The code `() => {
      messaging()
        .deleteToken()
        .catch(error => {
          console.log('Delected token error ', error);
        });
    }` is a function that deletes the device token used for push notifications. It is called when
  the `deletedToken` method of the `FCMService` class is invoked. The function uses the
  `messaging()` method from the `@react-native-firebase/messaging` library to access the messaging
  functionality and delete the token. If an error occurs during the deletion process, it is caught
  and logged to the console. **/
  deletedToken = () => {
    messaging()
      .deleteToken()
      .catch(error => {
        console.log('Delected token error ', error);
      });
  };

  createNoitificationListeners = (onRegister, onOpenNotification, appState) => {
    // Triggered  when a particular  notification  has been recevied in foreground
    this.notificationListener = messaging().onMessage(data =>
      onNotificationNotiFee(data, appState),
    );

    // If your app is backgound, you can listen for when a
    //notification is clicked / tapped / opened as follows
    this.notificationOpenedListener = messaging().onNotificationOpenedApp(
      notification => {
        // console.log(notification);
        if (notification) onOpenNotification(notification);
        // this.removeDelieveredNotification(notification);
      },
    );

    // if your app is closed, you can check if  it was opened by notification
    // being  clicked / tapped / opened as follows
    messaging()
      .getInitialNotification()
      .then(notification => {
        if (notification) onOpenNotification(notification);
        // this.removeDelieveredNotification(notification);
      });

    // Triggered when have  new token
    this.onTokenRefreshListener = messaging().onTokenRefresh(onRegister);

    this.forgroundListener = notifee.onForegroundEvent(
      async ({type, detail}) => {
        const {notification} = detail;
        const isPressed = Boolean(
          type === EventType.ACTION_PRESS || type == EventType.PRESS,
        );
        if (isPressed) onOpenNotification(notification);
        if (type !== 7) await this.setBadge();
      },
    );
    this.backgroundListner = notifee.onBackgroundEvent(
      async ({type, detail}) => {
        const {notification} = detail;
        const isPressed = Boolean(
          type === EventType.ACTION_PRESS || type == EventType.PRESS,
        );
        if (isPressed) onOpenNotification(notification);
        if (type !== 7) await this.setBadge();
      },
    );
  };
  setBadge = (badge = 0) => notifee.setBadgeCount(badge);
  unRegister = () => {
    this.notificationListener();
    this.notificationOpenedListener();
    this.onTokenRefreshListener();
    this.forgroundListener();
    this.deletedToken();
    console.log('FCMService unRegister successfully');
  };
}

export const fcmService = new FCMService();
