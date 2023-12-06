import {useState, useEffect, useRef} from 'react';
import {Platform, Linking} from 'react-native';
import {showError, showSuccess} from '../../services/SnackBar';
import {getUser, updateAuth} from '../../store/actions/auth-action';
import API from '../../services/API';
import useReduxStore from '../../hooks/useReduxStore';
import {generateSubViewObject} from '../../utils/helper';

const skus = Platform.select({
  ios: {skus: ['29102022138', '2510202248']},
  android: {skus: ['25102022653', '29102022152', '29102022200']},
});
const useSubscription = (navigation, {params}) => {
  return {};
};

export default useSubscription;
