import React from 'react';
import {Image, Platform, StyleSheet, Text, View} from 'react-native';
import {Colors, FontFamily, Sizes} from '../../theme/Variables';
import {Touchable} from '../../components/Touchable';
import {back} from '../../Assets/Images';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

function Header({goBack}) {
  return (
    <>
      <Touchable onPress={goBack}>
        <Image
          source={back}
          style={{
            // width: widthPercentageToDP('11'),
            height: heightPercentageToDP('6.2'),
            aspectRatio: 1,
            marginLeft: widthPercentageToDP('-1'),
            marginTop:
              Platform.OS == 'ios'
                ? heightPercentageToDP('-2')
                : heightPercentageToDP('0'),
            marginBottom: heightPercentageToDP('2'),
          }}
        />
      </Touchable>
      <View>
        <Text numberOfLines={2} style={styles.heading}>
          What is your gender?
        </Text>
        <Text style={styles.subTitle}>
          This helps us find the best content for you. It is private and will
          not be shared.
        </Text>
      </View>
    </>
  );
}

export default Header;

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    textAlign: 'left',
    color: Colors.white,
    maxWidth: Sizes.width * 0.7,
    fontFamily: FontFamily.bold,
  },
  subTitle: {
    fontSize: 20,
    textAlign: 'left',
    marginVertical: 30,
    color: Colors.fadedGray,
    fontFamily: FontFamily.regular,
  },
});
