import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {Colors, FontFamily} from '../../theme/Variables';
import {points, streak, time} from '../../Assets/Images';
import {Touchable} from '../../components/Touchable';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

const Record = ({
  total_sessions,
  longest_streak,
  total_minutes,
  consecutive_days,
}) => (
  <View style={styles.box}>
    <Touchable Opacity={0.7} style={styles.bottomBox}>
      <Image source={streak} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.bottomHeading}>{total_sessions}</Text>
        <Text numberOfLines={2} style={styles.bottomPara}>
          Total Sessions
        </Text>
      </View>
    </Touchable>
    <Touchable Opacity={0.7} style={styles.bottomBox}>
      <Image source={time} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.bottomHeading}>{total_minutes}</Text>
        <Text numberOfLines={2} style={styles.bottomPara}>
          Total Minutes
        </Text>
      </View>
    </Touchable>
    <Touchable Opacity={0.7} style={styles.bottomBox}>
      <Image source={points} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.bottomHeading}>{consecutive_days}</Text>
        <Text numberOfLines={2} style={styles.bottomPara}>
          Consecutive Days
        </Text>
      </View>
    </Touchable>
  </View>
);
export default Record;

const styles = StyleSheet.create({
  box: {
    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: Colors.transparent,
  },
  bottomBox: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  bottomHeading: {
    fontSize: 24,
    textAlign: 'center',
    color: Colors.green,
    fontFamily: FontFamily.regular,
  },
  bottomPara: {
    // width: 80,
    width: widthPercentageToDP('20'),
    fontSize: widthPercentageToDP('3'),
    marginTop: 10,
    color: Colors.white,
    textAlign: 'center',
    fontFamily: FontFamily.regular,
    // backgroundColor: 'yellow',
  },
  textContainer: {
    // marginRight: 10,
    // position: 'absolute',
    // right: -10,
  },
  icon: {
    width: 65,
    height: 65,
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 30,
    left: 10,
  },
});
