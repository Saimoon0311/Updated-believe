// import React from 'react';
// import {Colors, FontFamily} from '@/theme/Variables';
// import {Linking, Platform, StyleSheet, Text, View} from 'react-native';
// import {Touchable} from './Touchable';
// import API from '@/services/API';
// import InAppBrowser from '@/services/InAppBrowser';
// import {believePackagsAndroidSKU} from '@/utils/helper/LocalDb';
// import {
//   heightPercentageToDP,
//   widthPercentageToDP,
// } from 'react-native-responsive-screen';
// import Purchases from 'react-native-purchases';
// import {store} from '@/store/store';
// import {updateAuth, updateSub} from '@/store/actions/auth-action';
// import {getDataRenewCat} from '@/utils/helper';
// import useReduxStore from '@/hooks/useReduxStore';

// const SubscriptionCard = ({navigate, user, onRefresh}) => {
//   const {dispatch} = useReduxStore();
//   const subscription_type = user.user?.user_subscription?.subscription_type;
//   const life_time = user.user?.life_time;
//   const identifer = user.user?.identifer;
//   const isValid = Boolean(user?.user?.subscribed);
//   const userD = user.user;
//   console.log(
//     'users============================================>',
//     userD.store,
//   );
//   const subscribeRoute = () => {
//     // if (!isValid) navigate('SubscriptionTest', {title: 'Subscription'});
//     if (!isValid) navigate('Subscription', {title: 'Subscription'});
//     else manageSubscription();
//     // else Alert.alert('Coming Soon');
//   };
//   const subscribeManage = async () => {
//     // Using packages
//     dispatch(updateAuth({loading: true}));
//     // const androidSKU = believePackagsAndroidSKU
//     try {
//       // const purchaseMade = await Purchases.purchaseProduct(marked.identifier);
//       const {ok, datas} = await getDataRenewCat();
//       if (ok) {
//         const getNewPack = datas.filter(
//           res => res.product.identifier != identifer,
//         )[0];
//         const {customerInfo} = await Purchases.purchasePackage(getNewPack, {
//           prorationMode: Purchases.PRORATION_MODE.IMMEDIATE_WITHOUT_PRORATION,
//           oldSKU: identifer,
//         });
//         const {activeSubscriptions, originalAppUserId} = customerInfo;
//         const title = getNewPack?.product?.title.split(' ')[0];

//         // await API.post('/validate-receipt', {
//         //   platform: Platform.OS,
//         //   payload: {},
//         //   customer_id: customerInfo.originalAppUserId,
//         // });
//         const userData = {
//           ...userD,
//           revenuecat_customer_id: originalAppUserId,
//           user_subscription: {
//             change_possible: true,
//             subscription_type: title,
//           },
//           is_subscribed: true,
//           subscribed: true,
//         };
//         dispatch(updateSub(userData));
//         // setAttributeRev(userData);
//         // onBackHandler();
//         dispatch(updateAuth({loading: false}));
//       }
//       dispatch(updateAuth({loading: false}));
//     } catch (e) {
//       dispatch(updateAuth({loading: false}));
//       if (!e.userCancelled) {
//         console.log('errr =====>>>>>', e);
//       }
//     }
//   };
//   const manageSubscription = async () => {
//     try {
//       if (Platform.OS == 'ios' && userD.store != 'stripe') {
//         Linking.openURL('https://apps.apple.com/account/subscriptions');
//       } else if (Platform.OS == 'android' && userD.store != 'stripe') {
//         Linking.openURL(
//           `https://play.google.com/store/account/subscriptions?sku=${
//             user?.user_subscription?.subscription_type == 'Yearly'
//               ? believePackagsAndroidSKU[0]
//               : believePackagsAndroidSKU[1]
//           }`,
//         );
//       } else {
//         InAppBrowser.open(
//           `https://believehypnosis.app/manage?token=${user.token}`,
//           onRefresh,
//         );
//       }
//     } catch (error) {
//       console.log('manageSubscription', error);
//     }
//   };

//   // const manageSubscription = async () => {
//   //   try {
//   //     const {ok, data} = await API.get('/list-web-subscription');
//   //     if (ok && data?.subscriptions?.length) {
//   //       const {platform, product_id} = data?.subscriptions[0];
//   //       if (platform == Platform.OS) {
//   //         if (Platform.OS == 'ios')
//   //           Linking.openURL('https://apps.apple.com/account/subscriptions');
//   //         else
//   //           Linking.openURL(
//   //             `https://play.google.com/store/account/subscriptions?sku=${believePackagsAndroidSKU[1]}&package=com.anideos.believe`,
//   //             // `https://play.google.com/store/account/subscriptions?package=com.anideos.believe&sku=${believePackagsAndroidSKU[1]}`,
//   //           );
//   //       } else
//   //         InAppBrowser.open(
//   //           // `http://192.168.0.233:8080/subscriptionDetail?${user.token}`,
//   //           // `https://believehypnosis.app/subscriptionDetail/${user.token}`,
//   //           `https://believehypnosis.app/subscriptionDetail?token=${user.token}`,
//   //           // `https://believehypnosis.app/subscription-mob/${user.token}`,
//   //           // `https://believe-website.staginganideos.com/subscription-mob/${user.token}`,
//   //         );
//   //     }
//   //   } catch (error) {
//   //     console.log('manageSubscription', error);
//   //   }
//   // };

//   return (
//     <View style={styles.container}>
//       <View>
//         <Text style={styles.heading}>Subscription</Text>
//         <Text style={styles.subHeading}>{subscription_type || 'Free'}</Text>
//       </View>
//       <View>
//         {!isValid ? (
//           <Touchable
//             style={styles.button}
//             Opacity={0.7}
//             onPress={subscribeRoute}>
//             <Text style={styles.buttonText}>Upgrade</Text>
//           </Touchable>
//         ) : (
//           <View style={{alignItems: 'center'}}>
//             {isValid && life_time != 'true' && userD.store != 'stripe' && (
//               <Touchable
//                 style={{
//                   ...styles.button,
//                   marginBottom: heightPercentageToDP('1'),
//                 }}
//                 Opacity={0.7}
//                 onPress={subscribeManage}>
//                 <Text
//                   style={{
//                     ...styles.buttonText,
//                     paddingHorizontal: widthPercentageToDP('2'),
//                     paddingVertical: heightPercentageToDP('1'),
//                   }}>
//                   {subscription_type == 'Monthly' ? 'Upgrade' : 'Downgrade'}
//                 </Text>
//               </Touchable>
//             )}
//             <Text onPress={manageSubscription} style={styles.manageButton}>
//               Manage Subscriptions
//             </Text>
//           </View>
//         )}
//       </View>
//     </View>
//   );
// };

// export default SubscriptionCard;

// const styles = StyleSheet.create({
//   container: {
//     height: 90,
//     borderRadius: 10,
//     alignItems: 'center',
//     flexDirection: 'row',
//     paddingHorizontal: 20,
//     justifyContent: 'space-between',
//     backgroundColor: Colors.fadeBlue,
//   },
//   heading: {
//     fontSize: 20,
//     paddingLeft: 10,
//     textAlign: 'left',
//     color: Colors.white,
//     fontFamily: FontFamily.medium,
//   },
//   subHeading: {
//     fontSize: 18,
//     paddingTop: 5,
//     paddingLeft: 10,
//     textAlign: 'left',
//     color: Colors.yellow2,
//     fontFamily: FontFamily.regular,
//   },
//   button: {
//     borderRadius: 10,
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     backgroundColor: Colors.greenFaded,
//   },
//   buttonText: {
//     fontSize: 12,
//     color: Colors.white,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     textTransform: 'uppercase',
//     fontFamily: FontFamily.medium,
//   },
//   manageButton: {
//     fontSize: heightPercentageToDP('1.5'),
//     color: 'white',
//     textDecorationLine: 'underline',
//     fontWeight: 'bold',
//   },
// });

import React from 'react';
import {Colors, FontFamily} from '../theme/Variables';
import {Alert, Linking, Platform, StyleSheet, Text, View} from 'react-native';
import {Touchable} from './Touchable';
import InAppBrowser from '../services/InAppBrowser';
import {believePackagsAndroidSKU} from '../utils/helper/LocalDb';

const SubscriptionCard = ({navigate, user}) => {
  const subscription_type = user.user?.user_subscription?.subscription_type;
  const isValid = Boolean(user?.user?.is_subscribed);
  const subscribeRoute = () => {
    if (!isValid) navigate('Subscription', {title: 'Subscription'});
    else manageSubscription();
    // else Alert.alert('Coming Soon');
  };

  const manageSubscription = async () => {
    console.log('usersdsdsdsdsdsd', user.user);
    try {
      if (Platform.OS == 'ios' && user.user.store == 'APP_STORE') {
        Linking.openURL('https://apps.apple.com/account/subscriptions');
      } else if (Platform.OS == 'android' && user.user.store == 'PLAY_STORE') {
        Linking.openURL(
          `https://play.google.com/store/account/subscriptions?sku=${
            user?.user_subscription?.subscription_type == 'Yearly'
              ? believePackagsAndroidSKU[0]
              : believePackagsAndroidSKU[1]
          }`,
        );
      } else if (Platform.OS == 'android' && user.user.store == 'APP_STORE') {
        // Linking.openURL(`https://believehypnosis.app/help`);
        InAppBrowser.open(`https://believehypnosis.app/help`);
      } else if (Platform.OS == 'ios' && user.user.store == 'PLAY_STORE') {
        // Linking.openURL(`https://believehypnosis.app/help`);
        InAppBrowser.open(`https://believehypnosis.app/help`);
      } else {
        // Linking.openURL(
        //   `https://believehypnosis.app/manage?token=${user.token}`,
        // );
        InAppBrowser.open(
          `https://believehypnosis.app/manage?token=${user.token}`,
        );
      }
    } catch (error) {
      console.log('manageSubscription', error);
    }
  };
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.heading}>Subscription</Text>
        <Text style={styles.subHeading}>{subscription_type || 'Free'}</Text>
      </View>
      <Touchable style={styles.button} Opacity={0.7} onPress={subscribeRoute}>
        {user.user.life_time != 'true' && (
          <Text style={styles.buttonText}>
            {!isValid ? 'Upgrade' : 'Manage'}
          </Text>
        )}
      </Touchable>
    </View>
  );
};

export default SubscriptionCard;

const styles = StyleSheet.create({
  container: {
    height: 85,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    backgroundColor: Colors.fadeBlue,
  },
  heading: {
    fontSize: 20,
    paddingLeft: 10,
    textAlign: 'left',
    color: Colors.white,
    fontFamily: FontFamily.medium,
  },
  subHeading: {
    fontSize: 18,
    paddingTop: 5,
    paddingLeft: 10,
    textAlign: 'left',
    color: Colors.yellow2,
    fontFamily: FontFamily.regular,
  },
  button: {
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.greenFaded,
  },
  buttonText: {
    fontSize: 12,
    color: Colors.white,
    paddingVertical: 10,
    paddingHorizontal: 20,
    textTransform: 'uppercase',
    fontFamily: FontFamily.medium,
  },
});
