import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {bottomTabRoute, Colors} from '../theme/Variables';
import CommonTabScreen from './LibraryStack';

const Tab = createBottomTabNavigator();
const HomeStack = () => <CommonTabScreen screen="HomeStack" />;
const LibraryStack = () => <CommonTabScreen screen="LibraryStack" />;

const EventStack = () => <CommonTabScreen screen="EventStack" />;

const SearchStack = () => <CommonTabScreen screen="SearchStack" />;

const MeStack = () => <CommonTabScreen screen="MeStack" />;

/**
 * The MainTabScreen function returns a Tab Navigator component with multiple screens for different
 * sections of an app.
 */
const MainTabScreen = () => (
  <Tab.Navigator
    screenOptions={bottomTabRoute}
    sceneContainerStyle={{backgroundColor: Colors.primaryColor}}>
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Library" component={LibraryStack} />
    <Tab.Screen name="Event" component={EventStack} />
    <Tab.Screen name="Search" component={SearchStack} />
    <Tab.Screen name="Me" component={MeStack} />
  </Tab.Navigator>
);

export default React.memo(MainTabScreen);
