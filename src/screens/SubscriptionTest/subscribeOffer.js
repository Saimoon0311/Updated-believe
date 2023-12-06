import React, {Fragment} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import {checked} from '../../Assets/Images';
import BadgeCard from '../../components/BadgeCard';
import NextButton from '../../components/NextButton';
import {styles} from './styles';
import InAppBrowser from '../../services/InAppBrowser';
import {getUser, updateAuth} from '../../store/actions/auth-action';
import useReduxStore from '../../hooks/useReduxStore';
import Purchases from 'react-native-purchases';
import {showError} from '../../services/SnackBar';
import {
  believePackagsAndroidSKU,
  believePackagsIosSKU,
} from '../../utils/helper/LocalDb';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {storeValue} from '../../services/storage';
import API from '../../services/API';
// const openBrowser = url => Linking.openURL(url);
const openBrowser = url => InAppBrowser.open(url);
// const openBrowser = () => Alert.alert('Will be redirect on web page');

const SubscribeOffer = ({showPlan, price, onContinue, onBackHandler}) => {
  const {dispatch, getState} = useReduxStore();
  const user2 = getState('Auth');
  const restoreHandler = () => {
    Alert.alert('Warning', 'Are you sure you want to restore your purchase?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          updateAuth({loading: true});
          onRestore();
        },
      },
    ]);
  };

  // const onRestore = async () => {
  //   updateAuth({loading: true});
  //   try {
  //     const restore = await Purchases.restorePurchases();

  //     // dispatch(getUser());
  //     if (restore.entitlements.active['AppStorePlans'] != undefined) {
  //       var platform =
  //         Platform.OS == 'ios'
  //           ? believePackagsIosSKU[0]
  //           : believePackagsAndroidSKU[0];
  //       var title =
  //         restore.entitlements.active['AppStorePlans'].productIdentifier ==
  //         platform
  //           ? 'Yearly'
  //           : 'Monthly';
  //       userData = {
  //         ...user,
  //         user_subscription: {
  //           change_possible: true,
  //           subscription_type: title,
  //         },
  //         is_subscribed: true,
  //       };
  //       dispatch(getUser());
  //       // dispatch(updateSub(userData));
  //       updateAuth({loading: false});
  //     }
  //     updateAuth({loading: false});
  //     // ... check restored purchaserInfo to see if entitlement is now active
  //   } catch (e) {
  //     showError('failed to fatech data');
  //     updateAuth({loading: false});
  //     console.log('e', e);
  //   }
  // };

  const onRestore = async () => {
    updateAuth({loading: true});
    console.log('djsbjkbdsjkvbdjksbvjkbdsbdsjvds', user2);
    try {
      const restore = await Purchases.restorePurchases();
      console.log(
        "restore.entitlements.active['AppStorePlsdasdasdasans']restore.entitlements.active['AppStorePlans']restore.entitlements.active['AppStorePlans']",
        restore.entitlements.active['AppStorePlans'],
      );
      // dispatch(getUser());
      if (restore.entitlements.active['AppStorePlans'] != undefined) {
        console.log('skjdbjbsdjkcbsdkjbcskjdb');
        var platform =
          Platform.OS == 'ios'
            ? believePackagsIosSKU[0]
            : believePackagsAndroidSKU[0];
        var title =
          restore.entitlements.active['AppStorePlans'].productIdentifier ==
          platform
            ? 'Yearly'
            : 'Monthly';

        console.log('titletitletitletitletitletitle', title);
        const {data} = await API.post('/set-restore-identifier', {
          identifier:
            restore.entitlements.active['AppStorePlans'].productIdentifier,
          rev_id: restore.originalAppUserId,
        });

        console.log('titletitletitletitletitletitle', data);
        userData = {
          ...user2.user,
          user_subscription: {
            change_possible: true,
            subscription_type: title,
          },
          subscribed: true,
          is_subscribed: true,
          store: restore.entitlements.active['AppStorePlans'].store,
          identifer:
            restore.entitlements.active['AppStorePlans'].productIdentifier,
        };
        let user = {...user2, ...userData};
        storeValue('suscribe', 'true');
        // dispatch(getUser());
        console.log(
          'useruseruseruserusdfknsdklbfdsbfkbdsfdjksjkdsbseruseruser',
          userData,
        );
        dispatch(updateAuth({user}));
        onBackHandler();
        console.log('jbsdjkbbdbsbvbdkbdsjk');
      }
      updateAuth({loading: false});
      showError('no purchase available');
      // ... check restored purchaserInfo to see if entitlement is now active
    } catch (e) {
      showError('failed to fatech data');
      updateAuth({loading: false});
      console.log('e', e);
    }
  };

  return (
    <View
      style={{
        paddingTop: heightPercentageToDP('15.2'),
      }}>
      <View style={[styles.mainContainer, {flex: 1, justifyContent: 'center'}]}>
        <Text
          style={[
            styles.heading,
            {fontSize: heightPercentageToDP('4'), fontWeight: '400'},
          ]}>
          Unlock Believe Premium FREE!
        </Text>
        <View
          style={[
            styles.badgeBox,
            {
              marginVertical: heightPercentageToDP('2'),
              alignItems: 'flex-start',
            },
          ]}>
          <BadgeCard
            {...{
              title: 'Speed Up Your Manifestations',
              icon: checked,
            }}
          />

          <BadgeCard
            {...{
              title: 'Access 1000 + Powerful LOA Hypnosis Audios',
              icon: checked,
            }}
          />
          <BadgeCard
            {...{
              title: 'Members Only Personal Growth Courses',
              icon: checked,
            }}
          />
          <BadgeCard
            {...{
              title: 'Videos, Scripts, Live Events + Much More',
              icon: checked,
            }}
          />
          <BadgeCard
            {...{
              title: `Start Living a Happier, More Abundant Life Now`,
              icon: checked,
            }}
          />
        </View>
      </View>

      <NextButton onPress={onContinue} buttonTitle="Continue" />
      <Text
        style={[styles.durationText, {fontSize: heightPercentageToDP('2')}]}>
        {`14 days free trial then ${price} / year. \n Cancel anytime`}
      </Text>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          marginTop: heightPercentageToDP('8'),
        }}>
        <TouchableOpacity onPress={showPlan} style={styles.button}>
          <Text style={styles.durationText}>View Other Plans</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottom}>
        <Text onPress={restoreHandler} style={styles.cancelHeading}>
          Restore
        </Text>
        <Text
          // onPress={() => Linking.openURL('https://believehypnosis.app/terms')}
          onPress={() => openBrowser('https://believehypnosis.app/terms')}
          style={styles.cancelHeading}>
          Terms
        </Text>
        <Text
          onPress={() => openBrowser('https://believehypnosis.app/billing')}
          // onPress={() => Linking.openURL('https://believehypnosis.app/billing')}
          style={styles.cancelHeading}>
          Billing
        </Text>
      </View>
    </View>
  );
};

export default React.memo(SubscribeOffer);
