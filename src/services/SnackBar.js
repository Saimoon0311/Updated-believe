import {Colors} from '../theme/Variables';
import Snackbar from 'react-native-snackbar';
const duration = Snackbar.LENGTH_LONG;
const textColor = Colors.white;

/**
 * The function `showSuccess` displays a success message using a Snackbar component in JavaScript.
 **/
const showSuccess = text =>
  Snackbar.show({
    text,
    duration,
    backgroundColor: Colors.primaryColor,
    textColor,
  });

/**
 * The `showInfo` function displays a Snackbar with the provided text and custom styling.
 **/
const showInfo = text =>
  Snackbar.show({
    text,
    duration,
    backgroundColor: Colors.primaryColor,
    textColor,
  });

/**
 * The function `showError` displays a Snackbar with an error message.
 **/
const showError = text =>
  Snackbar.show({
    text,
    duration,
    backgroundColor: Colors.errorColor,
    textColor,
  });

export {showError, showInfo, showSuccess};
