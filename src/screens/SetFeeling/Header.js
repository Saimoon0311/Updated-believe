import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Colors, FontFamily, Sizes} from '../../theme/Variables';
import {back} from '../../Assets/Images';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {Touchable} from '../../components/Touchable';

function Header({goNext, goBack}) {
  return (
    <>
      <Touchable onPress={goBack}>
        <Image
          source={back}
          style={{
            // width: widthPercentageToDP('11'),
            height: heightPercentageToDP('6.2'),
            marginLeft: widthPercentageToDP('2'),
            aspectRatio: 1,
            marginTop: heightPercentageToDP('2'),
          }}
        />
      </Touchable>
      <View style={styles.header}>
        <View style={styles.container}>
          <Text numberOfLines={2} style={styles.heading}>
            How do you want to feel today?
          </Text>
          {/* <Touchable onPress={goNext} Opacity={0.7}>
          <Text style={styles.text}>Done</Text>
        </Touchable> */}
        </View>
      </View>
    </>
  );
}

export default Header;

const styles = StyleSheet.create({
  header: {
    padding: '5%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 24,
    textAlign: 'left',
    color: Colors.white,
    maxWidth: Sizes.width * 0.7,
    fontFamily: FontFamily.bold,
  },
  text: {
    fontSize: 18,
    textAlign: 'right',
    color: Colors.greenFaded,
    fontFamily: FontFamily.medium,
  },
  subTitle: {
    fontSize: 18,
    marginTop: 5,
    textAlign: 'left',
    color: Colors.gray,
    fontFamily: FontFamily.regular,
  },
});
