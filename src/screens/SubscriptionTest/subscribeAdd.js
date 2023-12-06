import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import {cloud, content, reward, sessions} from '../../Assets/Images';
import PageHeading from '../../components/PageHeading';
import useSubscription from './useSubscription';
import {normal} from '../../Assets/lottie';
import BadgeCard from '../../components/BadgeCard';
import {styles} from './styles';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AnimatedBackground from '../../components/AnimatedBackground';

const SubscribeAdd = ({navigation, route}) => {
  return <AnimatedBackground animation={normal}></AnimatedBackground>;
};

export default React.memo(SubscribeAdd);
