import auth from '@react-native-firebase/auth';
import {Dirs, FileSystem} from 'react-native-file-access';
import moment from 'moment';
import {nanoid} from 'nanoid';
import currency from 'currency.js';
import Purchases from 'react-native-purchases';
import API from '../../services/API';
import TrackPlayer, {Capability, RepeatMode} from 'react-native-track-player';
import {audioFile} from '../../store/sagas/music-saga';
import {store} from '../../store/store';
import Types from '../../store/saga-types';
import {storeValue} from '../../services/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * The function `getCredentials` returns different base URLs depending on whether the code is running
 * in a development environment or not.
 * @returns The function `getCredentials` returns an object with a `baseURL` property. The value of
 * `baseURL` depends on the value of the `__DEV__` variable. If `__DEV__` is truthy, the `baseURL` is
 * set to `'https://api.believehypnosis.app/api'`. Otherwise, if `__DEV__` is falsy,
 */
const getCredentials = () => {
  if (__DEV__)
    return {
      baseURL: 'https://api.believehypnosis.app/api',
      // baseURL: 'https://virtualrealitycreators.com/Believe-Backend/api',
    };
  else {
    console.log = () => {};
    return {
      baseURL: 'https://api.believehypnosis.app/api',
    };
  }
};

/**
 * The function `deviceStorage` returns the available storage space on the device.
 */
export const deviceStorage = () => FileSystem.df();

/**
 * The `loginUser` function takes an email and password as parameters and uses Firebase authentication
 * to sign in the user.
 */
const loginUser = ({email, password}) =>
  auth().signInWithEmailAndPassword(email, password);

/**
 * The function `registerUser` creates a new user with the provided email and password using Firebase
 * authentication.
 */
const registerUser = ({email, password}) =>
  auth().createUserWithEmailAndPassword(email, password);

/**
 * The function `resetUserEmail` sends a password reset email to the user's email address.
 */
const resetUserEmail = ({email}) => auth().sendPasswordResetEmail(email);

/**
 * The function signInWithFirebase takes in a data parameter and signs in the user with the provided
 * credential.
 */
const signInWithFirebase = data => auth().signInWithCredential(data);

/**
 * The function `getFbResult` returns the ID token result of the current user.
 */
const getFbResult = () => auth().currentUser.getIdTokenResult();

// Helper Functions

const minuteCall = num => {
  const duration = Number(Math.floor(num / 60));
  return duration == 0 ? 1 : duration;
};

/**
 * The function `durationCall` takes a duration in seconds and returns a formatted string representing
 * the duration in hours and minutes.
 * @returns The function `durationCall` returns a formatted string representing the duration. The
 * format of the string depends on the values of `hour`, `minute`, and `second`. The possible return
 * values are:
 */
const durationCall = duration => {
  const hour = moment.utc(duration * 1000).format('HH');
  const minute = moment.utc(duration * 1000).format('mm');
  const second = moment.utc(duration * 1000).format('ss');
  const checkHr = Boolean(hour != '00');
  const checkMin = Boolean(minute != '00');
  const checkSec = Boolean(second != '00');
  if (!checkHr && !checkMin && !checkSec) return `${minute}:${second} min`;
  else if (!checkHr && !checkMin && checkSec) return `${minute}:${second} min`;
  else if (!checkHr && checkMin && !checkSec) return `${minute}:${second} min`;
  else if (!checkHr && checkMin && checkSec) return `${minute}:${second} min`;
  else if (checkHr && checkMin && checkSec) return `${hour}:${minute} hr`;
  else if (checkHr && !checkMin && checkSec) return `${hour}:${minute} hr`;
  else if (checkHr && checkMin && !checkSec) return `${hour}:${minute} hr`;
  else if (checkHr && !checkMin && !checkSec) return `${hour}:${minute} hr`;
};

/**
 * The function `courseTimeView` converts a given time in seconds into a formatted string representing
 * the hours, minutes, and seconds.
 * @returns The function `courseTimeView` returns a formatted string representing the time in hours,
 * minutes, and seconds.
 */
const courseTimeView = time => {
  const hour = moment.utc(time * 1000).format('HH');
  const minute = moment.utc(time * 1000).format('mm');
  const second = moment.utc(time * 1000).format('ss');
  const checkHr = Boolean(hour != '00');
  const checkMin = Boolean(minute != '00');
  const checkSec = Boolean(second != '00');
  if (!checkHr && !checkMin && !checkSec) return `${minute}min ${second}sec`;
  else if (!checkHr && !checkMin && checkSec)
    return `${minute}min ${second}sec`;
  else if (!checkHr && checkMin && !checkSec)
    return `${minute}min ${second}sec`;
  else if (!checkHr && checkMin && checkSec) return `${minute}min ${second}sec`;
  else if (checkHr && checkMin && checkSec) return `${hour}hr ${minute}min`;
  else if (checkHr && !checkMin && checkSec) return `${hour}hr ${minute}min`;
  else if (checkHr && checkMin && !checkSec) return `${hour}hr ${minute}min`;
  else if (checkHr && !checkMin && !checkSec) return `${hour}hr ${minute}min`;
};
/**
 * The function `meditationTimeView` takes a time in seconds and returns a formatted string
 * representing the time in hours, minutes, and seconds.
 * @returns The function `meditationTimeView` returns a formatted string representing the time in
 * hours, minutes, and seconds.
 */
const meditationTimeView = time => {
  const hour = moment.utc(time * 1000).format('HH');
  const minute = moment.utc(time * 1000).format('mm');
  const second = moment.utc(time * 1000).format('ss');
  return `${hour}h ${minute}m ${second}s`;
};

/**
 * The function `eventDateView` takes a date as input and returns a string indicating if the event is
 * happening today, tomorrow, a week later, yesterday, or returns the original date if none of the
 * conditions are met.
 * @returns The function `eventDateView` returns a string representing the event date. The possible
 * return values are:
 */
const eventDateView = date => {
  let date_1 = new Date(date);
  let date_2 = new Date();
  const days = (date_1, date_2) => {
    let difference = date_1.getTime() - date_2.getTime();
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    return TotalDays;
  };
  const dateFiiter = days(date_1, date_2);
  if (dateFiiter == 0) {
    return `Today's Event`;
  } else if (dateFiiter == 1) {
    return `Tomorrow's Event`;
  } else if (dateFiiter == 7) {
    return `A Week Later`;
  } else if (dateFiiter == -1) {
    return `Yesterday's Event`;
  } else {
    return date;
  }
};

/**
 * The function `generateDiscountStr` takes a price string and a discount code as input, splits the
 * price string to extract the price and currency, and returns a formatted string with the price
 * divided by 12 and rounded to 2 decimal places.
 * @param priceStr - The `priceStr` parameter is a string that represents the price of a product or
 * service. It may contain a currency symbol, a space, and the price value. For example, it could be
 * "USD 100" or "EUR 50".
 * @param code - The `code` parameter is a variable that represents a discount code. It is not used in
 * the `generateDiscountStr` function.
 * @returns The function `generateDiscountStr` returns a string in the format `
 * ${(Number(price?.split(',').join('')) / 12).toFixed(2)}/month`.
 */
const generateDiscountStr = (priceStr, code) => {
  let array = priceStr?.split(/\s{1}/);
  console.log('price string', priceStr);
  const price = array?.length && array[array?.length - 1];
  const currency = array?.length && array[array?.length - 2];
  return `${currency} ${(Number(price?.split(',').join('')) / 12).toFixed(
    2,
  )}/month`;
};

/**
 * The function `generateSubViewObject` generates a subview object with title, price, package title,
 * and discount price based on the input subItem.
 * @returns The function `generateSubViewObject` returns an object with the properties `title`,
 * `price`, `packageTitle`, and `discountPrice`.
 */
const generateSubViewObject = subItem => {
  let packageTitle = '';
  let price = '';
  let title = '';
  let productId = '';
  let discountPrice;

  if (subItem?.platform == 'ios') {
    packageTitle =
      subItem?.subscriptionPeriodUnitIOS == 'MONTH' ? 'Monthly' : 'Yearly';
    price = subItem?.price;
    title = subItem?.title;
    productId = subItem?.productId;
    discountPrice = generateDiscountStr(price, subItem?.currency);
  } else {
    packageTitle =
      subItem?.subscriptionOfferDetails[0]?.pricingPhases?.pricingPhaseList[0]
        ?.billingPeriod == 'P1M'
        ? 'Monthly'
        : 'Yearly';
    price =
      subItem?.subscriptionOfferDetails[0]?.pricingPhases?.pricingPhaseList[0]
        ?.formattedPrice;
    title = subItem?.name;
    productId = subItem?.productId;
    discountPrice = generateDiscountStr(price);
  }
  return {
    title,
    price,
    packageTitle,
    discountPrice,
  };
};

/**
 * The function `onShareFromApp` makes a POST request to the `/unlock-badge` endpoint with the provided
 * `badge` data.
 */
const onShareFromApp = async badge => {
  await API.post('/unlock-badge', {badge});
};

/**
 * The function generates a subview object for Android based on the provided subItem, index, and
 * productIDs.
 * @param subItem - An array containing the subscription details for a particular item.
 * @param index - The `index` parameter represents the index of the subItem in the array. It is used to
 * determine the packageTitle value, which is set to 'Monthly' if index is 0, and 'Yearly' otherwise.
 * @param productIDs - The `productIDs` parameter is an object that contains the IDs of different
 * products. It is used to retrieve the specific product ID based on the `packageTitle` value.
 * @returns an object with the following properties:
 */
const generateSubViewObjectAndroid = (subItem, index, productIDs) => {
  let packageTitle = '';
  let price = '';
  let title = '';
  let offerToken = '';
  let discountPrice;

  packageTitle = index == 0 ? 'Monthly' : 'Yearly';
  price =
    subItem[0]?.subscriptionOfferDetails[index]?.pricingPhases
      ?.pricingPhaseList[0]?.formattedPrice;
  offerToken = subItem[0]?.subscriptionOfferDetails[index]?.offerToken;
  discountPrice = generateDiscountStr(price);
  return {
    title,
    price,
    packageTitle,
    discountPrice,
    offerToken,
    productId: productIDs[packageTitle],
    subscriptionOfferDetails: subItem[0]?.subscriptionOfferDetails,
  };
};

/**
 * The function `viewsFormatter` takes a number as input and formats it to display in a shortened
 * format with a suffix of B, M, or K depending on the magnitude of the number.
 * @param num - The parameter `num` represents the number of views.
 * @returns a formatted string representation of the input number. If the number is greater than or
 * equal to 1 billion, it is divided by 1 billion and formatted with one decimal place, with any
 * trailing ".0" removed, and the letter "B" appended. If the number is greater than or equal to 1
 * million, it is divided by 1 million and formatted similarly with the
 */
function viewsFormatter(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num;
}

const musicSwitch = async appMusic => {
  try {
    if (appMusic) {
      await TrackPlayer.setRepeatMode(RepeatMode.Track);
      await TrackPlayer.updateOptions({
        stopWithApp: true,
        capabilities: [Capability.Play, Capability.Pause, Capability.Stop],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.Stop,
        ],
      });
      await TrackPlayer.add(audioFile);
      await TrackPlayer.play();
      await AsyncStorage.setItem('bgMusic', 'true');
      return;
    } else {
      await TrackPlayer.reset();
      await AsyncStorage.setItem('bgMusic', 'false');
    }
    store.dispatch({type: Types.Auth_Update, payload: {appMusic: true}});
  } catch (error) {
    console.log('on toggle music error', error);
  }
};

/**
 * The function getCurrentTimeWithFormat returns the current date in the format "YYYY-MM-DD".
 * @returns The function `getCurrentTimeWithFormat` returns the current date in the format
 * "YYYY-MM-DD".
 */
const getCurrentTimeWithFormat = () => {
  const date = new Date();
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, '0');
  var day = String(date.getDate()).padStart(2, '0');

  var formattedDate = year + '-' + month + '-' + day;
  return formattedDate;
};

/**
 * The function `timeLayout` takes a time value and returns it formatted as "hh:mm A".
 * @returns The function `timeLayout` returns a formatted time string in the format "hh:mm A".
 */
const timeLayout = time => {
  return moment(time).format('hh:mm A');
};

/**
 * The AMPMLayout function checks if the given time is between 6 AM and 6 PM.
 * @returns a boolean value. It returns true if the hours of the given time parameter are between 6
 * (inclusive) and 19 (exclusive), indicating that it is daytime. Otherwise, it returns false,
 * indicating that it is nighttime.
 */
const AMPMLayout = time => {
  const now = new Date(time);
  const hours = now.getHours();
  const minutes = now.getMinutes();
  if (hours >= 6 && hours < 19) return true;
  else return false;
};

/**
 * The `contentTime` function formats a given time in seconds into a string representation of hours,
 * minutes, and seconds.
 * @param time - The `time` parameter represents a duration in seconds.
 * @param [format=false] - A boolean value indicating whether to format the time as hours, minutes, and
 * seconds or as a string in the format "HH:mm:ss".
 * @returns The function `contentTime` returns a formatted string representing the time. If the
 * `format` parameter is `false` or not provided, the function returns the time in the format
 * "HH:mm:ss" (hours:minutes:seconds). If the `format` parameter is `true`, the function returns the
 * time in a more human-readable format, such as "1 hour 30 minutes 45
 */
const contentTime = (time, format = false) => {
  if (!format) {
    const hour = moment.utc(time * 1000).format('HH');
    const minute = moment.utc(time * 1000).format('mm');
    const second = moment.utc(time * 1000).format('ss');
    return hour == '00' ? `${minute}:${second}` : `${hour}:${minute}:${second}`;
  }
  const hour = moment.utc(time * 1000).format('HH');
  const minute = moment.utc(time * 1000).format('mm');
  const second = moment.utc(time * 1000).format('ss');
  const hoursFormatted = hour !== '00' ? `${hour} hour ` : '';
  const minutesFormatted = minute !== '00' ? `${minute} minutes ` : '';
  const secondFormatted = second !== '00' ? `${second} seconds` : '';
  return [hoursFormatted, minutesFormatted, secondFormatted].join('');
};
/**
 * The function `contentTimeWithOutSec` formats a given time value in hours, minutes, and seconds, and
 * optionally returns it in a specific format.
 * @param time - The `time` parameter is a number representing the time in seconds.
 * @param [format=false] - A boolean value indicating whether to format the time in hours and minutes
 * or not. If set to true, the time will be formatted as "hours minutes", otherwise it will be
 * formatted as "hours:minutes:seconds".
 * @returns The function `contentTimeWithOutSec` returns a formatted string representing the time. If
 * the `format` parameter is `false`, it returns the time in the format `HH:mm:ss`
 * (hours:minutes:seconds). If the `format` parameter is `true`, it returns the time in a more
 * human-readable format, such as `1 hour 30 minutes`.
 */
const contentTimeWithOutSec = (time, format = false) => {
  if (!format) {
    const hour = moment.utc(time * 1000).format('HH');
    const minute = moment.utc(time * 1000).format('mm');
    const second = moment.utc(time * 1000).format('ss');
    return hour == '00' ? `${minute}:${second}` : `${hour}:${minute}:${second}`;
  }
  const hour = moment.utc(time * 1000).format('HH');
  const minute = moment.utc(time * 1000).format('mm');
  const second = moment.utc(time * 1000).format('ss');
  const hoursFormatted = hour !== '00' ? `${hour} hour ` : '';
  const minutesFormatted = minute !== '00' ? `${minute} minutes` : '';
  const secondFormatted = second !== '00' ? `${second} seconds` : '';
  return [hoursFormatted, minutesFormatted].join('');
};

/**
 * The function `secondsToTime` converts a given time in seconds into hours, minutes, and seconds.
 * @returns The function `secondsToTime` returns an object with three properties: `seconds`, `minutes`,
 * and `hours`.
 */
export const secondsToTime = timeInSeconds => {
  const hours = Math.floor(timeInSeconds / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((timeInSeconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(timeInSeconds % 60)
    .toString()
    .padStart(2, '0');
  return {seconds, minutes, hours};
};

const randomNanoIdGenerator = () => nanoid();
const keyExtractor = item => item?.id;

/**
 * The function `durationAsString` takes a date as input and returns the duration between the current
 * time and the input date in the format of "X days X hours X minutes".
 * @returns a string that represents the duration between the current date and the provided date in the
 * format "X days X hours X minutes".
 */
const durationAsString = date => {
  const start = new Date();
  const currentTime = new Date(date);
  currentTime.setDate(start.getDate());
  if (start.getTime() > currentTime.getTime())
    currentTime.setDate(start.getDate() + 1);

  const duration = moment.duration(moment(currentTime).diff(moment(start)));

  //Get Days
  const days = Math.floor(duration.asDays()); // .asDays returns float but we are interested in full days only
  const daysFormatted = days ? `${days}day ` : ''; // if no full days then do not display it at all

  //Get Hours
  const hours = duration.hours();
  const hoursFormatted = hours ? `${hours}hr ` : '';

  //Get Minutes
  const minutes = duration.minutes();
  const minutesFormatted = minutes ? `${minutes}min` : '';

  return [daysFormatted, hoursFormatted, minutesFormatted].join('');
};
const skuIOS = ['3101202313', '31012023'];
/**
 * The function `getDataRenewCat` retrieves available subscription packages for a given revenuecat
 * customer ID.
 * @returns The function `getDataRenewCat` returns a promise that resolves to an object with the
 * properties `ok` and `datas`. The `ok` property indicates whether the operation was successful or
 * not, and the `datas` property contains an array with two elements: `yearlyPackages` and
 * `monthlyPackages`.
 */
const getDataRenewCat = async revenuecat_customer_id => {
  return new Promise(async (resolve, reject) => {
    try {
      const offerings = await Purchases.getOfferings();
      console.log('packages', offerings);
      const allProducts = offerings.current.availablePackages;
      console.log('allProducts', allProducts);
      const yearlyPackages = allProducts.filter(
        res => res.product.subscriptionPeriod == 'P1Y',
      )[0];
      const monthlyPackages = allProducts.filter(
        res => res.product.subscriptionPeriod == 'P1M',
      )[0];
      console.log('======>>>>>', yearlyPackages, monthlyPackages);
      resolve({ok: true, datas: [yearlyPackages, monthlyPackages]});
    } catch (e) {
      reject({ok: false, datas: e});
    }
  });
};

/**
 * The function `setAttributeRev` sets the email and display name attributes for a user in a Purchases
 * object.
 */
const setAttributeRev = user => {
  console.log('userdata ', user);
  Purchases.setEmail(user?.email);
  Purchases.setDisplayName(user?.name);
  // Purchases.setAttributes({
  //   'Package-Name': user.user_subscription.subscription_type,
  //   // 'Package-Name': 'testinf',
  // });
};

export {
  getCredentials,
  loginUser,
  registerUser,
  resetUserEmail,
  signInWithFirebase,
  getFbResult,
  minuteCall,
  durationCall,
  courseTimeView,
  meditationTimeView,
  viewsFormatter,
  eventDateView,
  timeLayout,
  AMPMLayout,
  contentTime,
  randomNanoIdGenerator,
  keyExtractor,
  durationAsString,
  generateSubViewObject,
  generateSubViewObjectAndroid,
  generateDiscountStr,
  getDataRenewCat,
  setAttributeRev,
  getCurrentTimeWithFormat,
  contentTimeWithOutSec,
  onShareFromApp,
  musicSwitch,
};
