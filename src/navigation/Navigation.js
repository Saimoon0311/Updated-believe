import React, {Fragment, useEffect, useLayoutEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CardStyleInterpolators} from '@react-navigation/stack';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import * as Screens from '../screens/Screens/Screens';
import MainTabScreen from './MainTabScreen';
import OnboardStack from './OnboardStack';
import useReduxStore from '../hooks/useReduxStore';
import {animationConfig} from '../theme/Variables';
import NavigationService from '../services/NavigationService';
import branch from 'react-native-branch';
import {Platform} from 'react-native';
import {getUser} from '../store/actions/auth-action';
import {getValue} from '../services/storage';

const Stack = createNativeStackNavigator();

const Navigation = ({isLogin, onBoard}) => {
  const {getState, dispatch} = useReduxStore();
  const {user} = getState('Auth');
  // const isIntro = Boolean(user?.onboard_pass == 'false');
  /** The line `const isAppIntro = Boolean(onBoard == 'true');` is checking if the value of the `onBoard`
variable is equal to the string `'true'`. If it is, then `isAppIntro` will be set to `true`,
otherwise it will be set to `false`. The `Boolean()` function is used to convert the result of the
comparison (`onBoard == 'true'`) to a boolean value. **/
  const isAppIntro = Boolean(onBoard == 'true');

  /** The `useLayoutEffect` hook is used to perform side effects in a React component. In this case, it is
dispatching the `getUser` action and logging some information to the console. **/
  useLayoutEffect(() => {
    dispatch(getUser());
    console.log('chec k jsc ajk cjka s', NavigationService.ref, user);
  }, []);
  /**
   * The function `is_subscribedCheckFun` checks if a user is subscribed and navigates to the
   * subscription page if they are not.
   **/

  const is_subscribedCheckFun = () => {
    const valueSub = getValue('suscribe');
    const getNameFunc = NavigationService.getCurrentRoute();
    const routeName = getNameFunc?.getCurrentRoute()?.name;
    console.log(
      'nasckja cjksd jkc sdjkc dsjc sdczxczxczxczxcjkc jd cjsd jd jc djs cj scdjs',
      valueSub,
    );
    if (
      NavigationService.ref &&
      isLogin &&
      valueSub == 'false'
      // &&       routeName == 'MainTabScreen'
      // NavigationService.ref &&
      // isLogin &&
      // user.subscribed != true
    ) {
      console.log(
        'nasckja cjksd jkc sdjkc dsjc sdjkc jd czdczxczxczxczjsd jd jc djs cj scdjs',
        user.is_subscribed,
      );
      // if (NavigationService.ref && isLogin && user.subscribed == false) {
      NavigationService.navigate('Subscription');
    }
  };

  /** The `useEffect` hook is used to perform side effects in a React component. In this case, it is
dispatching the `getUser` action and calling the `is_subscribedCheckFun` function after a delay of
1500 milliseconds. **/
  useEffect(() => {
    dispatch(getUser());
    setTimeout(() => {
      is_subscribedCheckFun();
    }, 1500);

    let timOutRef = null;

    /** The `branch.subscribe` function is used to subscribe to deep link events from the Branch.io SDK. It
takes a callback function as an argument, which will be called whenever a deep link event occurs. **/
    branch.subscribe(async ({error, params, ...rest}) => {
      console.log('error=======,,,,,,,,,,', Platform.OS, error, params);
      if (
        Platform.OS == 'android' &&
        !NavigationService.ref &&
        params['+clicked_branch_link']
      )
        timOutRef = setTimeout(() => {
          NavigationService.navigate(
            'MusicPlayer',
            JSON.parse(params?.content_data),
          );
        }, 4000);
      else if (params['+clicked_branch_link'] && NavigationService.ref) {
        console.log('params----------', params);
        NavigationService.navigate(
          'MusicPlayer',
          JSON.parse(params?.content_data),
        );
      }

      return () => {
        console.log('timOutRef', timOutRef);
        clearTimeout(timOutRef);
      };
    });
  }, [NavigationService.ref]);

  return (
    <SafeAreaProvider
      style={{backgroundColor: 'black'}}
      initialMetrics={initialWindowMetrics}>
      {/* <NavigationContainer
        ref={ref => {
          NavigationService.setRef(ref);
          // const p = NavigationService.getCurrentRoute(ref.getCurrentRoute());
        }}> */}
      <Stack.Navigator screenOptions={animationConfig}>
        {isLogin && (
          <Stack.Group>
            <Stack.Screen name="MainTabScreen" component={MainTabScreen} />
            <Stack.Screen
              name="VideoPlayScreen"
              component={Screens.VideoPlayScreen}
            />
            <Stack.Screen name="MusicPlayer" component={Screens.MusicPlayer} />
            <Stack.Screen
              name="VideoContent"
              component={Screens.VideoContent}
            />
            <Stack.Screen
              name="AudioContent"
              component={Screens.AudioContent}
            />
            <Stack.Screen
              name="PlaylistDetails"
              component={Screens.PlaylistDetails}
            />
            <Stack.Screen
              name="SessionTimer"
              component={Screens.SessionTimer}
            />
            <Stack.Screen
              name="EditPlaylist"
              component={Screens.EditPlaylist}
            />
            <Stack.Screen
              name="AddPlayListData"
              component={Screens.AddPlayListData}
            />
            <Stack.Screen
              name="PlayListEdit"
              component={Screens.PlayListEdit}
            />
            <Stack.Screen
              name="SortPlaylist"
              component={Screens.SortPlaylist}
            />
            <Stack.Screen
              name="Congratulations"
              component={Screens.Congratulations}
              options={{
                cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
              }}
            />
            <Stack.Screen
              name="Subscription"
              component={Screens.Subscription}
              options={{
                cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
              }}
            />
            <Stack.Screen
              name="SubscriptionTest"
              component={Screens.SubscriptionTest}
              options={{
                cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
              }}
            />
            <Stack.Screen
              name="SubscriptionAndroid"
              component={Screens.SubscriptionAndroid}
              options={{
                cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
              }}
            />
            <Stack.Screen name="Thankyou" component={Screens.Thankyou} />
          </Stack.Group>
        )}

        {!isLogin && (
          <Stack.Group>
            {isAppIntro && (
              <Fragment>
                <Stack.Screen
                  name="Onboarding"
                  component={Screens.Onboarding}
                />
                <Stack.Screen name="Welcome" component={Screens.Welcome} />
              </Fragment>
            )}

            <Stack.Screen name="Login" component={Screens.Login} />
            <Stack.Screen name="Register" component={Screens.Register} />
            <Stack.Screen name="Forget" component={Screens.Forget} />
            <Stack.Screen
              name="Verification"
              component={Screens.Verification}
            />
            <Stack.Screen name="NewPassword" component={Screens.NewPassword} />
            <Stack.Screen name="Update" component={Screens.Update} />
            <Stack.Screen name="OnboardStack" component={OnboardStack} />
          </Stack.Group>
        )}
      </Stack.Navigator>
      {/* </NavigationContainer> */}
    </SafeAreaProvider>
  );
};

export default Navigation;
