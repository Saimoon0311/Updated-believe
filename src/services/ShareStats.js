import {onShareFromApp} from '../utils/helper';
import {Platform} from 'react-native';
import Share from 'react-native-share';
import {captureRef} from 'react-native-view-shot';

/**
 * It takes a ref, a message, a title, a callback, and an error handler, and then it captures the ref
 * as a base64 image, and then it opens the share dialog with the base64 image as the url, and then it
 * calls the callback
 * @param ref - The ref of the component you want to capture.
 * @param [message=Believe App Stats] - The message to be shared.
 * @param [title=Believe App Stats] - The title of the share sheet
 * @param [callBack] - This is the function that will be called when the user successfully shares the
 * image.
 * @param [onError] - This is a callback function that will be called if there is an error while
 * sharing.
 **/

export const shareStats = async (
  ref,
  // message = 'Believe App Stats \n Download the app using this link ',
  message = 'Believe App Stats ',
  // message = 'Believe App Stats \n Download the app using this link \n https://believehypnosis.app.link',
  title = 'Believe App Stats',
  callBack = async () => {
    console.log('callback,valvnsklnvkdn');
    await onShareFromApp('Influencer');
  },
  onError = error => console.log('onError', error),
) => {
  try {
    // console.log('refrefrefrefrefrefrefrefrefrefref', ref);
    const base64 = await captureRef(ref, {
      // result: 'base64',
      format: 'png',
      quality: 0.8,
    });
    const base64Data = `data:image/png;base64,` + base64;
    // const contentText = `${message}\n${base64Data}`;
    // console.log(
    //   'refrefrefrefrefrefrekdsjksdvjkvdjksvdsfrefrefrefref',
    //   base64Data,
    // );
    await Share.open({
      url: base64,
      message,
      title,
      // type: 'image/png',
    });
    await callBack();
  } catch (error) {
    // console.log('djdjkdsjk jksd jds jkds jk sdjk djks jkdds ', error);
    onError(error);
  }
};
