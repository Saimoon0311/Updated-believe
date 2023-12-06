import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {Colors, FontFamily} from '../theme/Variables';
import BackButton from './BackButton';
import {Touchable} from './Touchable';
import {back} from '../Assets/Images';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

const SelectionHeader = ({title, navigation, backButton, backFunction}) => {
  return (
    <View style={styles.container}>
      <Touchable Opacity={0.7} onPress={backFunction} style={styles.button}>
        <Image source={back} resizeMode="contain" style={styles.back} />
      </Touchable>
      <Text numberOfLines={1} style={styles.heading}>
        {title}
      </Text>
      <BackButton {...{navigation, backButton}} />
    </View>
  );
};

export default SelectionHeader;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: '5%',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: heightPercentageToDP('3'),
    // width: '80%',
    textAlign: 'center',
    color: Colors.white,
    paddingVertical: 20,
    fontFamily: FontFamily.medium,
  },
  button: {
    width: 50,
    height: 50,
    justifyContent: 'center',
  },
  back: {
    width: widthPercentageToDP('10'),
    height: heightPercentageToDP('10'),
    marginVertical: '5%',
  },
});
