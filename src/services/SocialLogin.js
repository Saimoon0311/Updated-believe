import {AccessToken, LoginManager} from 'react-native-fbsdk-next';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';

// useEffect(() => {

// }, []);

/** The SocialLogin class provides methods for logging in and out with Facebook, Google, and Apple
authentication. **/
class SocialLogin {
  /** The code block is defining an asynchronous function that logs in a user with Facebook
  authentication. Here's a breakdown of what it does: **/
  logInWithfacebook = async () => {
    this.logoutWithFacebook();
    LoginManager.setLoginBehavior('web_only');
    const {isCancelled} = await LoginManager.logInWithPermissions([
      'email',
      'public_profile',
    ]);
    if (isCancelled) throw new Error('Cancelled');
    else {
      const {accessToken} = await AccessToken.getCurrentAccessToken();
      const token = auth.FacebookAuthProvider.credential(accessToken);
      return token;
    }
  };

  logoutWithFacebook = () => LoginManager.logOut();

  /** The `logInWithgoogle` function is responsible for logging in a user with Google authentication.
Here's a breakdown of what it does: **/
  logInWithgoogle = async () => {
    const hasPlayService = await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
    if (!hasPlayService) throw new Error('play services not available');
    const isSignIn = await GoogleSignin.isSignedIn();
    if (isSignIn) await this.logOutWithGoogle();
    const {idToken, user} = await GoogleSignin.signIn();
    const token = auth.GoogleAuthProvider.credential(idToken);
    return {...token, ...user};
  };

  logOutWithGoogle = async () => {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    console.log('logOutWithGoogle');
  };

  /** The code block you provided is an asynchronous function that handles logging in a user with Apple
  authentication. Here's a breakdown of what it does: **/
  logInWithapple = async () => {
    if (!appleAuth.isSupported)
      throw new Error(
        'AppleAuth is not supported on the device. Currently Apple Authentication works on iOS devices running iOS 13 or later',
      );
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    if (!appleAuthRequestResponse.identityToken)
      throw new Error('Apple Sign-In failed - no identify token returned');

    const {
      identityToken,
      nonce,
      fullName: {givenName, familyName},
    } = appleAuthRequestResponse;
    const token = auth.AppleAuthProvider.credential(identityToken, nonce);
    return {token, name: `${givenName || ''} ${familyName || ''}`};
  };
}

export default new SocialLogin();
