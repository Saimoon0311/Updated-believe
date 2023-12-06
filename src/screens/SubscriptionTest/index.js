import BadgeCard from '../../components/BadgeCard';
import SafeView from '../../components/SafeView';
import React, {Fragment, useEffect, useState} from 'react';
import {View, Text, ImageBackground, ScrollView, Platform} from 'react-native';
import Purchases from 'react-native-purchases';
import {styles} from './styles';
import * as Images from '../../Assets/Images';
import SubscribeCardTest from '../../components/SubscribeCardTest';
import NextButton from '../../components/NextButton';
import SubscribeOffer from './subscribeOffer';
import {showError} from '../../services/SnackBar';
import {
  generateDiscountStr,
  getDataRenewCat,
  setAttributeRev,
} from '../../utils/helper';
import {store} from '../../store/store';
import API from '../../services/API';
import useReduxStore from '../../hooks/useReduxStore';
import {getUser, updateAuth, updateSub} from '../../store/actions/auth-action';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {storeValue} from '../../services/storage';

// const skuIOS = ['AppStorePlans'];
const skuIOS = ['3101202313', '31012023'];

/**
 * The SubscriptionsTest function is a React component that handles the subscription process, including
 * displaying available plans, allowing the user to select a plan, and handling the purchase and
 * validation of the selected plan.
 * @returns The code is returning a React component that renders a subscription screen.
 **/
const SubscriptionsTest = ({navigation, route}) => {
  const {getState, dispatch} = useReduxStore();
  const {user} = getState('Auth');
  const {trial_used} = user;

  // const {revenuecat_customer_id} = user;
  const [subscription, setSubscription] = useState([]);
  const [marked, setMarked] = useState({});
  const [plan, setPlan] = useState(false);
  /**
   * The function `getDataRenCat` retrieves data from a source called `getDataRenewCat`, sets the
   * retrieved data as the subscription and marked values, and logs the retrieved data to the console.
   **/
  const getDataRenCat = async () => {
    const {ok, datas} = await getDataRenewCat();
    if (ok) {
      setSubscription(datas);
      setMarked(datas[0]);
    }
    console.log('data', datas);
  };
  const setMarkHandler = item => {
    setMarked(item);
  };

  /**
   * The function `onBackHandler` checks if the user is signing up and not subscribed, and if so,
   * navigates to the 'Thankyou' screen, otherwise it goes back to the previous screen.
   **/
  const onBackHandler = () => {
    const {params} = route;
    const {user} = store.getState(state => state.Auth);
    if (params?.isSignUp && !user?.user?.is_subscribed)
      navigation.replace('Thankyou', params);
    else navigation.goBack();
  };

  /**
   * The `subscribePlan` function handles the process of subscribing to a plan, including making a
   * purchase, validating the receipt, and updating user data.
   **/
  const subscribePlan = async () => {
    // Using packages
    store.dispatch(updateAuth({loading: true}));
    try {
      // const purchaseMade = await Purchases.purchaseProduct(marked.identifier);

      const {customerInfo} = await Purchases.purchasePackage(marked, {
        prorationMode: Purchases.PRORATION_MODE.IMMEDIATE_WITHOUT_PRORATION,
      });
      const {activeSubscriptions, originalAppUserId} = customerInfo;
      const selectedPlan = subscription.filter(
        res => res.product.identifier == activeSubscriptions[0],
      )[0];
      const title = selectedPlan?.product?.title.split(' ')[0];

      await API.post('/validate-receipt', {
        platform: Platform.OS,
        payload: {},
        customer_id: customerInfo.originalAppUserId,
      });
      const userData = {
        ...user,
        revenuecat_customer_id: originalAppUserId,
        user_subscription: {
          change_possible: true,
          subscription_type: title,
        },
        store: customerInfo.entitlements.active['AppStorePlans'].store,
        is_subscribed: true,
        subscribed: true,
      };
      storeValue('suscribe', 'true');
      setAttributeRev(userData);
      dispatch(updateSub(userData));
      onBackHandler();
    } catch (e) {
      store.dispatch(updateAuth({loading: false}));
      showError(
        e.message.split(' ').slice(1).join(' ') || 'api request failed!',
      );
      if (!e.userCancelled) {
        console.log('errr =====>>>>>', e);
      }
    }
  };

  /**
   * The function "getCurrencySymbol" takes a price as input and returns the currency symbol by
   * removing all digits, commas, and periods from the input string.
   * @param price - The parameter "price" is a string representing a price value.
   * @returns the currency symbol from the given price.
   **/
  function getCurrencySymbol(price) {
    return price.replace(/[0-9,.]/g, '');
  }

  /**
   * The function calculates the discounted monthly price and returns it as a formatted string with the
   * currency symbol.
   * @param price - The `price` parameter represents the original price of a product or service.
   * @param priceString - The `priceString` parameter is a string that represents the currency symbol
   * used for the price.
   * @returns a string that represents the discounted monthly price, formatted with the currency symbol
   * from the priceString parameter.
   **/
  const getDiscountPrice = (price, priceString) => {
    const numMonths = 12;
    const discountedMonthlyPrice = price / numMonths;
    return `${getCurrencySymbol(priceString)}${discountedMonthlyPrice.toFixed(
      2,
    )}`;
  };

  /** The above code is written in JavaScript and is using the useEffect hook from React. **/
  useEffect(async () => {
    Purchases.addCustomerInfoUpdateListener(info => {
      const {activeSubscriptions} = info;
      console.log('========>>>>>', activeSubscriptions);
    });
    getDataRenCat();
  }, []);
  return (
    <ImageBackground
      source={Images.subscription}
      style={styles.backgroundImage}>
      <SafeView>
        {/* <RewardedAd
          unitId={TestIds.REWARDED}
          sizes={[BannerAdSize.FULL_BANNER]}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        /> */}
        <Text
          onPress={onBackHandler}
          style={[
            styles.heading,
            {
              textAlign: 'right',
              marginRight: 40,
              // marginVertical: heightPercentageToDP('2'),
              fontSize: heightPercentageToDP('2.5'),
            },
          ]}>
          X
        </Text>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}>
          {/* {plan || trial_used == 1 ? ( */}
          {plan ? (
            <Fragment>
              <Text
                style={[styles.heading, {fontSize: heightPercentageToDP('4')}]}>
                Unlock Believe Premium FREE!
              </Text>
              <View style={styles.mainContainer}>
                <View style={styles.badgeBox}>
                  <BadgeCard
                    {...{
                      title: 'Speed Up Your Manifestations',
                      icon: Images.checked,
                    }}
                  />

                  <BadgeCard
                    {...{
                      title: 'Access to 1000 + Powerful LOA Hypnosis Audios',
                      icon: Images.checked,
                    }}
                  />
                  <BadgeCard
                    {...{
                      title: 'Members Only Personal Growth Courses',
                      icon: Images.checked,
                    }}
                  />
                  <BadgeCard
                    {...{
                      title: 'Videos, Scripts, Live Events + Much More',
                      icon: Images.checked,
                    }}
                  />
                  <BadgeCard
                    {...{
                      title: `Start Living a Happier, More Abundant Life Now`,
                      icon: Images.checked,
                    }}
                  />
                </View>
              </View>
              <Text style={styles.planHeading}>Select Your Plan</Text>
              <Text
                style={[
                  styles.planHeading,
                  {marginVertical: 0, textAlign: 'left', fontSize: 16},
                ]}>
                Best Value
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  marginBottom: 20,
                }}>
                {subscription.length > 0 &&
                  subscription.map(res => {
                    return (
                      <SubscribeCardTest
                        {...{
                          key: marked,
                          item: res,
                          marked,
                          onPress: () => {},
                          onPress: setMarkHandler,
                          title: 'Annual - Billed \nat',
                          trial: '14 Days free',
                          discount: getDiscountPrice(
                            res.product.price,
                            res.product.priceString,
                          ),
                          traillUse: trial_used,
                        }}
                      />
                    );
                  })}

                {/* <SubscribeCardTest
                  {...{
                    key: marked,
                    item: subscription[1],
                    onPress: () => {},
                    // onPress: this.setMarkHandler,
                    marked,
                    title: 'Monthly payment',
                    discount: subscription[1]?.priceString,
                    // trial: '11.99/month',
                  }}
                /> */}
              </View>
              <View style={[styles.bottom, {flexDirection: 'column'}]}>
                <Text
                  style={[
                    styles.cancelHeading,
                    {
                      // opacity:
                      //   marked?.product?.subscriptionPeriod == 'P1Y' ? 1 : 0,
                      opacity: 1,
                      // marked?.product?.subscriptionPeriod == 'P1Y' &&
                      // trial_used == 0
                      //   ? 1
                      //   : 0,
                    },
                  ]}>
                  {marked?.product?.subscriptionPeriod == 'P1Y'
                    ? trial_used == 0 &&
                      `14 days free trial then ${
                        subscription.length > 0 &&
                        subscription.find(
                          res => res.product?.subscriptionPeriod == 'P1Y',
                        ).product.priceString
                      }/year. \n Cancel anytime`
                    : `${
                        subscription.length > 0 &&
                        subscription.find(
                          res => res.product?.subscriptionPeriod == 'P1M',
                        ).product.priceString
                      }/month. Cancel anytime`}
                </Text>
                <NextButton
                  disabled={!Boolean(marked?.identifier)}
                  onPress={subscribePlan}
                  buttonTitle="Continue"
                />
              </View>
            </Fragment>
          ) : (
            <SubscribeOffer
              showPlan={() => setPlan(true)}
              // price={generateSubViewObject(yearlyPkg).price}
              price={marked?.product?.priceString}
              onContinue={subscribePlan}
              marked={marked?.product}
              onBackHandler={() => onBackHandler()}
            />
            // revenuecat_customer_id == null && (
            //   <SubscribeOffer
            //     showPlan={() => setPlan(true)}
            //     // price={generateSubViewObject(yearlyPkg).price}
            //     price={marked?.product?.priceString}
            //     onContinue={subscribePlan}
            //     marked={marked.product}
            //   />
            // )
          )}
        </ScrollView>
      </SafeView>
    </ImageBackground>
  );
};

export default SubscriptionsTest;
