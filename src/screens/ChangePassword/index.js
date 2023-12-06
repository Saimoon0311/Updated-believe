import React from 'react';
import PageHeading from '../../components/PageHeading';
import KeyBoardWrapper from '../../components/KeyboardWrapper';
import {normal} from '../../Assets/lottie';
import AnimatedBackground from '../../components/AnimatedBackground';
import useFormHook from '../../hooks/useForm';
import Schemas from '../../utils/Validation';
import UpdateField from '../../components/UpdateField';
import SaveButton from '../../components/SaveButton';
import {View} from 'react-native';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {firebase} from '@react-native-firebase/auth';
import {store} from '../../store/store';
import {showError, showSuccess} from '../../services/SnackBar';
import {updateAuth} from '../../store/actions/auth-action';

/**
 * The `ChangePassword` function is a React component that allows users to change their password in a
 * Firebase authentication system.
 * @returns The code is returning a React component that renders a form for changing the user's
 * password. It includes input fields for the current password and new password, as well as a "Change
 * Password" button. The component also handles form validation and submission using the `handleSubmit`
 * function from the `useFormHook` hook.
 **/
const ChangePassword = ({navigation}) => {
  const {handleSubmit, errors, control} = useFormHook(Schemas.newPassword);

  /**
   * The function `changePassword` is an asynchronous function that updates the password of the current
   * user in a Firebase authentication system, after re-authenticating the user with their current
   * password.
   **/
  const changePassword = async currentPassword => {
    store.dispatch(updateAuth({loading: true}));
    const {new_password, password} = currentPassword;
    var user = firebase.auth().currentUser;
    try {
      const reauthenticate = currentPassword => {
        var crd = firebase.auth.EmailAuthProvider.credential(
          user.email,
          currentPassword,
        );
        return user.reauthenticateWithCredential(crd);
      };
      await reauthenticate(password);
      await user.updatePassword(new_password);
      showSuccess('Your password has been changed');
      navigation.goBack();
    } catch (error) {
      console.log('jksbvjksbjkbsjvbds', error);
      showError('Current password is wrong');
    } finally {
      store.dispatch(updateAuth({loading: false}));
    }
  };
  return (
    <AnimatedBackground animation={normal}>
      <PageHeading
        {...{title: 'ChangePassword', navigation, backButton: true}}
      />
      <KeyBoardWrapper>
        <View
          style={{
            flex: 1,
            marginTop: heightPercentageToDP('4'),
            paddingHorizontal: '5%',
          }}>
          <UpdateField
            {...{
              name: 'password',
              placeholder: 'Password',
              type: 'password',
              errors,
              control,
              isRequired: true,
              isSecure: true,
              // onChange: e => setCurrentPassword(e),
            }}
          />
          <UpdateField
            {...{
              name: 'new_password',
              placeholder: 'New Password',
              type: 'password',
              errors,
              control,
              isRequired: true,
              isSecure: true,
              // onChange: e => setNewPassword(e),
            }}
          />
          <SaveButton
            title="Change Password"
            onPress={handleSubmit(changePassword)}
          />
        </View>
      </KeyBoardWrapper>
    </AnimatedBackground>
  );
};

export default ChangePassword;
