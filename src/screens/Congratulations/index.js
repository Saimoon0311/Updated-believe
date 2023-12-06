import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Platform} from 'react-native';
import ViewShot from 'react-native-view-shot';
import {normal} from '../../Assets/lottie';
import PageHeading from '../../components/PageHeading';
import Animation from 'lottie-react-native';
import Button from '../../components/Button';
import {Colors, FontFamily, FontSize} from '../../theme/Variables';
import * as Badges from '../../Assets/lottie/unlockAnimation';
import * as Badgess from '../../Assets/lottie/index';
import StreakSection from '../Home/streakSection';
import useReduxStore from '../../hooks/useReduxStore';
import ShareButton from '../../components/ShareButton';
import {shareStats} from '../../services/ShareStats';
import AnimatedBackground from '../../components/AnimatedBackground';
import LottieView from 'lottie-react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

/**
 * The Achievement component is a JavaScript function that renders a view with a congratulatory
 * message, an animated badge, a description, streak sections, and a share button.
 * @returns The Achievement component is returning a ScrollView component that contains multiple
 * ViewShot components and other child components such as PageHeading, Text, Animation, LottieView,
 * StreakSection, ShareButton, and Button.Normal.
 **/
const Achievement = ({navigation, route}) => {
  /** A reference to the ViewShot component. **/
  const viewShotRef = useRef(null);
  /** Destructuring the getState function from the useReduxStore hook. **/
  const {getState} = useReduxStore();
  const [animationComplete, setAnimationComplete] = useState(false);
  /** Destructuring the homeContent from the Content reducer. **/
  const {homeContent} = getState('Content');
  /** Destructuring the user object from the Auth reducer. */
  const {user} = getState('Auth');
  const {params} = route;
  return (
    <ScrollView
      contentContainerStyle={styles.flex}
      bounces={false}
      showsVerticalScrollIndicator={false}>
      <ViewShot>
        <AnimatedBackground animation={normal}>
          <PageHeading {...{title: '', navigation, backButton: true}} />
          <ViewShot style={styles.mainContainer}>
            <ViewShot
              ref={viewShotRef}
              style={{
                alignItems: 'center',
                backgroundColor: 'rgba(5,33,65,0.8)',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}>
              <Text style={styles.congratsHeading}>Congratulations!</Text>
              {params.achievement_key ? (
                !animationComplete ? (
                  <Animation
                    source={Badges[params?.achievement_key]}
                    autoPlay
                    onAnimationFinish={() => setAnimationComplete(true)}
                    loop={false}
                    style={styles.badge}
                  />
                ) : (
                  <Animation
                    source={Badgess[params?.achievement_key]}
                    autoPlay
                    // loop={false}
                    style={styles.badge}
                  />
                )
              ) : !animationComplete ? (
                <LottieView
                  source={Badges[params?.name]}
                  autoPlay
                  onAnimationFinish={() => setAnimationComplete(true)}
                  loop={false}
                  style={styles.badge}
                  // loop={false}
                />
              ) : (
                <LottieView
                  source={Badgess[params?.name]}
                  autoPlay
                  // loop={false}
                  style={styles.badge}
                />
              )}
              <Text style={styles.desc}>{params?.description}</Text>
              <View
                style={{
                  ...styles.streaksContainer,
                  marginTop:
                    Platform.OS == 'android'
                      ? heightPercentageToDP('7.7')
                      : heightPercentageToDP('4.1'),
                  // marginTop: heightPercentageToDP('4.1'),
                }}>
                <StreakSection {...homeContent} />
              </View>
            </ViewShot>

            <View
              style={{
                ...styles.streaksContainer,
                backgroundColor: 'rgba(5,33,65,0.8)',
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                // top: heightPercentageToDP('-3.35'),
              }}>
              {animationComplete ? (
                <ShareButton
                  title="Share My Stats"
                  onPress={() => {
                    shareStats(viewShotRef);
                  }}
                />
              ) : (
                <ShareButton
                  title="Share My Stats"
                  style={{backgroundColor: 'rgba(5,33,65,0.2)'}}
                  textStyle={{color: 'rgba(255,255,255,0.2)'}}
                  imageStyle={{tintColor: 'rgba(255,255,255,0.2)'}}
                />
              )}
            </View>
            {Boolean(!user?.is_subscribed) && (
              <Button.Normal
                viewStyle={{marginTop: heightPercentageToDP('2')}}
                title="Unlock Believe Premium"
                onPress={() => navigation.navigate('Subscription')}
              />
            )}
          </ViewShot>
        </AnimatedBackground>
      </ViewShot>
    </ScrollView>
  );
};

/* React.memo is a higher order component. It’s similar to React.PureComponent but for function
components instead of classes. */
export default React.memo(Achievement);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    resizeMode: 'contain',
    backgroundColor: Colors.primaryColor,
  },
  mainContainer: {
    flex: 0.95,
    alignItems: 'center',
    paddingHorizontal: 20,
    // justifyContent: 'space-between',
    // backgroundColor: 'red',
  },
  congratsHeading: {
    fontSize: FontSize.scale32,
    color: Colors.white,
    fontFamily: FontFamily.regular,
    textTransform: 'uppercase',
  },
  badge: {
    height: 200,
    marginTop: heightPercentageToDP('1'),
    width: widthPercentageToDP('70'),
  },
  desc: {
    fontSize: FontSize.scale20,
    color: Colors.white,
    fontFamily: FontFamily.regular,
    textAlign: 'center',
    marginTop: heightPercentageToDP('5'),
  },
  streaksContainer: {
    // height: heightPercentageToDP('27'),
    width: '100%',
    // backgroundColor: 'rgba(5,33,65,0.8)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 15,
    justifyContent: 'space-between',
  },
});
