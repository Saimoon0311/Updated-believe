import React from 'react';
import {StyleSheet} from 'react-native';
import * as Screens from '../screens/Screens/Screens';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {animationConfig} from '../theme/Variables';

const Stack = createNativeStackNavigator();

/**
 * The above function creates a stack navigator for onboarding screens in a JavaScript application.
 */
const OnboardStack = () => (
  <Stack.Navigator screenOptions={animationConfig}>
    <Stack.Screen name="SetGoals" component={Screens.SetGoals} />
    <Stack.Screen name="SetGender" component={Screens.SetGender} />
    <Stack.Screen name="SetAge" component={Screens.SetAge} />
    <Stack.Screen name="SetFeeling" component={Screens.SetFeeling} />
    <Stack.Screen name="Thankyou" component={Screens.Thankyou} />
    <Stack.Screen name="ContentLoading" component={Screens.ContentLoading} />
    <Stack.Screen name="Welcome" component={Screens.Welcome} />
    <Stack.Screen name="Subscription" component={Screens.Subscription} />
  </Stack.Navigator>
);

export default OnboardStack;

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    resizeMode: 'contain',
  },
});
