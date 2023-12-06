import React, {Fragment, useEffect, useState} from 'react';
import {View, Text, ImageBackground, ScrollView, Platform} from 'react-native';
import Purchases from 'react-native-purchases';
import {styles} from './styles';
import * as Images from '../../Assets/Images';
import {showError} from '../../services/SnackBar';

const skuIOS = ['3101202313', '31012023'];

const skus = Platform.select({
  ios: {skus: ['31012023', '3101202313']},
  // ios: {skus: ['29102022138', '2510202248']},
  android: {skus: ['12122022_multiple_plans']},
});

const SubscriptionsTest = () => {
  return (
    <ImageBackground
      source={Images.subscription}
      style={styles.backgroundImage}></ImageBackground>
  );
};

export default SubscriptionsTest;
