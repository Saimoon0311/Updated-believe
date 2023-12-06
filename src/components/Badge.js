import React from 'react';
import {StyleSheet, View} from 'react-native';
import LottieView from 'lottie-react-native';
import * as Badges from '../Assets/lottie';
import {Touchable} from './Touchable';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

const Badge = ({item, onPress}) => (
  <Touchable onPress={() => (item?.unlocked_status ? onPress(item) : () => {})}>
    <View style={[styles.badgeContainer(item?.unlocked_status)]}>
      <LottieView
        source={Badges[item?.name]}
        autoPlay={item?.unlocked_status}
        style={styles.badge}
      />
    </View>
  </Touchable>
);

export default Badge;

const styles = StyleSheet.create({
  badgeContainer: locked => ({
    paddingHorizontal: widthPercentageToDP('1'),
    paddingVertical: heightPercentageToDP('0.5'),
    alignItems: 'center',
    justifyContent: 'center',
    opacity: locked ? 1 : 0.3,
  }),
  badge: {height: heightPercentageToDP('12'), width: widthPercentageToDP('25')},
});
