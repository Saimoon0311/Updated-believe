// import {View, Text, ScrollView, ImageBackground, Platform} from 'react-native';
// import React, {Component, Fragment} from 'react';
// import {
//   initConnection,
//   purchaseErrorListener,
//   purchaseUpdatedListener,
//   flushFailedPurchasesCachedAsPendingAndroid,
//   clearTransactionIOS,
//   requestSubscription,
//   getSubscriptions,
//   finishTransaction,
// } from 'react-native-iap';
// import * as Images from '@/Assets/Images';
// import {showError, showSuccess} from '@/services/SnackBar';
// import {getUser, updateAuth} from '@/store/actions/auth-action';
// import SafeView from '@/components/SafeView';
// import BadgeCard from '@/components/BadgeCard';
// import NextButton from '@/components/NextButton';
// import SubscribeCard from '@/components/SubscribeCard';
// import {styles} from './styles';
// import {generateSubViewObject} from '@/utils/helper';
// import SubscribeOffer from './subscribeOffer';
// import API from '@/services/API';

// const yearlyPackages = ['31012023', '29102022152'];
// // const yearlyPackages = ['29102022138', '29102022152'];

// import {store} from '@/store/store';
// const skus = Platform.select({
//   ios: {skus: ['31012023', '3101202313']},
//   // ios: {skus: ['29102022138', '2510202248']},
//   android: {skus: ['25102022653', '29102022152']},
// });

// class Subscriptions extends Component {
//   state = {subscription: [], marked: undefined, plan: false};
//   componentDidMount() {
//     initConnection().then(async () => {
//       try {
//         await this.clearTransaction();
//         const subs = await getSubscriptions(skus);
//         console.log('subs====>>>>>', subs);
//         this.setState({
//           subscription: subs,
//           marked: subs.filter(
//             sub => generateSubViewObject(sub)?.packageTitle == 'Yearly',
//           )[0],
//         });
//         this.purchaseUpdateSubscription = purchaseUpdatedListener(
//           async purchase => {
//             try {
//               // console.log('purchaseUpdateSubscription', purchase);
//               const receipt =
//                 Platform.OS == 'ios'
//                   ? purchase?.originalTransactionIdentifierIOS
//                   : purchase?.transactionReceipt;
//               console.log('recopejpdmv', receipt);
//               if (receipt) {
//                 const {data, ok} = await API.post('/validate-receipt', {
//                   platform: Platform.OS,
//                   payload: purchase,
//                 });
//                 if (ok) {
//                   store.dispatch(getUser());
//                   if (Platform.OS == 'ios')
//                     await finishTransaction({purchase, isConsumable: true});
//                   console.log('ios errror ', data);
//                   showSuccess(data?.message);
//                   this.onBackHandler();
//                 } else {
//                   console.log('ios errror ', data);

//                   showError(data?.message);
//                 }
//               }
//             } catch (error) {
//               showError(error?.message);
//             } finally {
//               store.dispatch(updateAuth({loading: false}));
//             }
//           },
//         );

//         this.purchaseErrorSubscription = purchaseErrorListener(error => {
//           store.dispatch(updateAuth({loading: false}));
//           console.warn('purchaseErrorListener', error);
//         });
//       } catch (error) {
//         store.dispatch(updateAuth({loading: false}));
//         console.log(error, 'initConnection error');
//       }
//     });
//   }

//   componentWillUnmount() {
//     if (this.purchaseUpdateSubscription) {
//       this.purchaseUpdateSubscription.remove();
//       this.purchaseUpdateSubscription = null;
//     }

//     if (this.purchaseErrorSubscription) {
//       this.purchaseErrorSubscription.remove();
//       this.purchaseErrorSubscription = null;
//     }
//   }

//   subscribe = async () => {
//     try {
//       const {marked} = this.state;
//       if (!marked?.productId) return;
//       store.dispatch(updateAuth({loading: true}));
//       console.log('marked', marked);
//       const {productId: sku, subscriptionOfferDetails} = marked;
//       console.log('after take data from marked');
//       const isAndroid =
//         subscriptionOfferDetails?.length && Platform.OS == 'android';
//       console.log('send data to android');
//       await requestSubscription({
//         sku,
//         andDangerouslyFinishTransactionAutomaticallyIOS: false,
//         ...(isAndroid && {
//           subscriptionOffers: [
//             // {
//             //   sku,
//             //   offerToken:
//             //     'AUj/YhjAffOQ99OSiCSU+y0H164fWhmU1JV4uGGghO+iloZWFwi7cHZJzYa2+jlFLPuq0KHNoeZVv6w/cbk2nWYTmpg0+fhcABsH9tyQTY8FMpH9T90ypN4CTQ==',
//             // },
//             {sku, offerToken: subscriptionOfferDetails[0]?.offerToken},
//           ],
//         }),
//       });
//       console.log('after all completed');
//     } catch (err) {
//       console.log('eror ', err);
//       store.dispatch(updateAuth({loading: false}));
//       if (
//         err?.message !==
//         'The operation couldn’t be completed. (SKErrorDomain error 2.)'
//       )
//         showError(err?.message);
//       store.dispatch(updateAuth({loading: false}));
//       console.log('openPaymentSheet err', err?.message);
//     }
//   };

//   clearTransaction = async () => {
//     if (Platform.OS == 'ios') await clearTransactionIOS();
//     else flushFailedPurchasesCachedAsPendingAndroid();
//   };

//   onBackHandler = () => {
//     const {navigation, route} = this.props;
//     const {params} = route;
//     const {user} = store.getState(state => state.Auth);
//     if (params?.isSignUp && !user?.user?.is_subscribed)
//       navigation.replace('Thankyou', params);
//     else navigation.goBack();
//   };

//   setMarkHandler = subItem => {
//     if (subItem?.productId !== this.state.marked?.productId)
//       this.setState({marked: subItem});
//     else this.setState({marked: {}});
//   };

//   render() {
//     const {subscription, marked, plan} = this.state;
//     const yearlyPkg = subscription?.filter(
//       sub => generateSubViewObject(sub)?.packageTitle == 'Yearly',
//     )[0];
//     const monthlyPkg = subscription?.filter(
//       sub => generateSubViewObject(sub)?.packageTitle == 'Monthly',
//     )[0];
//     return (
//       <ImageBackground
//         source={Images.subscription}
//         style={styles.backgroundImage}>
//         <SafeView>
//           <Text
//             onPress={this.onBackHandler}
//             style={[
//               styles.heading,
//               {textAlign: 'right', marginRight: 40, marginVertical: 10},
//             ]}>
//             X
//           </Text>
//           <ScrollView
//             contentContainerStyle={styles.container}
//             showsVerticalScrollIndicator={false}>
//             {plan ? (
//               <Fragment>
//                 <Text style={[styles.heading, {fontSize: 35}]}>
//                   Unlock Believe Premium FREE!
//                 </Text>
//                 <View style={styles.mainContainer}>
//                   <View style={styles.badgeBox}>
//                     <BadgeCard
//                       {...{
//                         title: 'Speed Up Your Manifestations',
//                         icon: Images.checked,
//                       }}
//                     />

//                     <BadgeCard
//                       {...{
//                         title: 'Access to 1000 + Powerful LOA Hypnosis Audios',
//                         icon: Images.checked,
//                       }}
//                     />
//                     <BadgeCard
//                       {...{
//                         title: 'Members Only Personal Growth Courses',
//                         icon: Images.checked,
//                       }}
//                     />
//                     <BadgeCard
//                       {...{
//                         title: 'Videos, Scripts, Live Events + Much More',
//                         icon: Images.checked,
//                       }}
//                     />
//                     <BadgeCard
//                       {...{
//                         title: `Start Living a Happier, More Abundant Life Now`,
//                         icon: Images.checked,
//                       }}
//                     />
//                   </View>
//                 </View>
//                 <Text style={styles.planHeading}>Select Your Plan</Text>
//                 <Text
//                   style={[
//                     styles.planHeading,
//                     {marginVertical: 0, textAlign: 'left', fontSize: 16},
//                   ]}>
//                   Best Value
//                 </Text>
//                 <View
//                   style={{
//                     flexDirection: 'row',
//                     marginTop: 10,
//                     marginBottom: 20,
//                   }}>
//                   <SubscribeCard
//                     {...{
//                       key: marked,
//                       item: yearlyPkg,
//                       marked,
//                       onPress: this.setMarkHandler,
//                       title: 'Annual - Billed \nat',
//                       trial: '14 Days free',
//                       discount: yearlyPkg?.discountPrice,
//                     }}
//                   />
//                   <SubscribeCard
//                     {...{
//                       key: marked,
//                       item: monthlyPkg,
//                       onPress: this.setMarkHandler,
//                       marked,
//                       title: 'Monthly payment',
//                       // trial: '11.99/month',
//                     }}
//                   />
//                 </View>
//                 <View style={[styles.bottom, {flexDirection: 'column'}]}>
//                   <Text
//                     style={[
//                       styles.cancelHeading,
//                       {
//                         opacity: yearlyPackages.includes(marked?.productId)
//                           ? 1
//                           : 0,
//                       },
//                     ]}>
//                     {`14 day free trial then ${
//                       generateSubViewObject(yearlyPkg).price
//                     } / year. \n Cancel anytime`}
//                   </Text>
//                   <NextButton
//                     disabled={!Boolean(marked?.productId)}
//                     onPress={this.subscribe}
//                     buttonTitle="Continue"
//                   />
//                 </View>
//               </Fragment>
//             ) : (
//               <SubscribeOffer
//                 showPlan={() => this.setState({plan: true})}
//                 price={generateSubViewObject(yearlyPkg).price}
//                 onContinue={this.subscribe}
//                 marked={marked}
//               />
//             )}
//           </ScrollView>
//         </SafeView>
//       </ImageBackground>
//     );
//   }
// }

// export default Subscriptions;

import {View, Text, ScrollView, ImageBackground, Platform} from 'react-native';
import React, {Component, Fragment} from 'react';
import * as Images from '../../Assets/Images';
import {styles} from './styles';

const yearlyPackages = ['31012023', '29102022152'];
// const yearlyPackages = ['29102022138', '29102022152'];

const skus = Platform.select({
  ios: {skus: ['31012023', '3101202313']},
  // ios: {skus: ['29102022138', '2510202248']},
  android: {skus: ['25102022653', '29102022152']},
});

class Subscriptions extends Component {
  render() {
    return (
      <ImageBackground
        source={Images.subscription}
        style={styles.backgroundImage}></ImageBackground>
    );
  }
}

export default Subscriptions;
