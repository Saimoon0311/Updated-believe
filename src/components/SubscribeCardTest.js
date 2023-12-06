import React from 'react';
import {View, Text, StyleSheet, Image, Platform} from 'react-native';
import {Colors, FontFamily, Sizes} from '../theme/Variables';
import {Touchable} from './Touchable';
import {radioOff, radioOn} from '../Assets/Images';
import {heightPercentageToDP} from 'react-native-responsive-screen';

const SubscribeCardTest = ({
  item,
  marked,
  onPress,
  title,
  trial,
  discount,
  traillUse,
}) => {
  // const {packageTitle, price, discountPrice} = generateSubViewObject(item);
  // console.log('item ===>>>>>>>>>', item);
  const {product} = item;
  const getFirstWork = title.split(' ');
  const dplicate = [...getFirstWork];
  dplicate.shift();
  // {product?.title} {'\n'}
  return (
    <Touchable onPress={() => onPress(item)} Opacity={0.7} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.subHeading}>
          {/* {packageTitle !== 'Monthly' ? ( */}
          {product?.subscriptionPeriod !== 'P1M' ? (
            <Text>
              <Text style={{fontWeight: 'bold'}}>{getFirstWork[0]}</Text>{' '}
              <Text>
                {dplicate} {product?.priceString}
              </Text>
            </Text>
          ) : (
            <Text style={{fontWeight: 'bold'}}>Monthly Package {'\n'}</Text>
          )}
        </Text>
        <Image
          source={marked?.identifier == item?.identifier ? radioOn : radioOff}
        />
      </View>

      <Text
        style={[
          styles.heading,
          {color: Colors.green, textTransform: 'capitalize'},
        ]}>
        {/* {product?.subscriptionPeriod == 'P1Y' ? trial : 'Monthly Payment'} */}
        {product?.subscriptionPeriod == 'P1Y'
          ? traillUse == 0
            ? trial
            : 'Yearly Payment'
          : 'Monthly Payment'}
      </Text>
      {product?.subscriptionPeriod == 'P1Y' ? (
        <Text style={[styles.heading, {marginTop: '25%'}]}>
          {discount + '/month'}
        </Text>
      ) : (
        <Text style={[styles.heading, {marginTop: '25%'}]}>
          {product?.priceString + '/month'}
        </Text>
      )}
      {/* {item?.title == 'Monthly Package' ? (
        <Text style={[styles.heading, {marginTop: '25%'}]}>
          {discount + '/month'}
        </Text>
      ) : (
        )} */}
    </Touchable>
  );
};

export default SubscribeCardTest;

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 10,
    width: '45%',
    height: 170,
    paddingHorizontal: 12,
    paddingVertical: 15,
    borderColor: Colors.borderBlue,
    backgroundColor: Colors.barFaded,
    marginRight: Sizes.width * 0.075,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subHeading: {
    fontSize: heightPercentageToDP('1.5'),
    marginTop: heightPercentageToDP('0'),
    color: Colors.white,
    fontFamily: FontFamily.regular,
    fontWeight: '600',
  },
  heading: {
    fontSize: 14,
    marginTop: 10,
    textAlign: 'left',
    color: Colors.white,
    fontFamily: FontFamily.medium,
  },
  vertical: {
    marginVertical: 10,
  },
  description: {
    fontSize: 12,
    textAlign: 'left',
    color: Colors.white,
    fontFamily: FontFamily.light,
  },
  trial: {
    fontSize: 12,
    textAlign: 'left',
    color: Colors.white,
    fontFamily: FontFamily.medium,
  },
  discount: {
    fontSize: 14,
    textAlign: 'left',
    color: Colors.white,
    fontFamily: FontFamily.medium,
  },
});
