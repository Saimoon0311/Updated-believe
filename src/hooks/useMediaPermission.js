import {Platform, Alert} from 'react-native';
import {request, PERMISSIONS, check} from 'react-native-permissions';

/** The `const permission` variable is determining the appropriate permission to request based on the
current platform. **/
const permission =
  Platform.OS == 'ios'
    ? PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY
    : PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION;

/** The `valid` variable is an array that contains the valid permission statuses. In this case, the
    valid permission statuses are 'granted' and 'limited'. These are the statuses that indicate that
    the user has granted the necessary permission to access the media. **/
const valid = ['granted', 'limited'];

/**
 * The `mediaPermission` function checks if the user has media permission, and if not, requests it and
 * resolves the promise with a boolean value indicating whether the permission was granted or not.
 * @returns The code is returning a Promise.
 */
export const mediaPermission = () => {
  /** The code block you provided is defining a function called `mediaPermission` that returns a Promise. **/
  return new Promise(async (resolve, reject) => {
    try {
      const hasPermission = await hasMediaPermission(permission);
      if (valid.includes(hasPermission)) resolve(true);
      else {
        const askPermission = await request(permission);
        if (valid.includes(askPermission)) resolve(true);
        else {
          resolve(false);
          Alert.alert(
            `Please allow media for using Media status is ${askPermission}`,
          );
        }
        console.log(
          'askPermission',
          askPermission,
          'hasPermission',
          hasPermission,
        );
      }
    } catch (error) {
      console.log(error);
      reject(false);
    }
  });
};

export const hasMediaPermission = () => check(permission);
