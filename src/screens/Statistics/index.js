import React from 'react';
import {View, ScrollView} from 'react-native';
import {normal} from '../../Assets/lottie';
import PageHeading from '../../components/PageHeading';
import ShareButton from '../../components/ShareButton';
import CalendarStats from './CalendarStats';
import useStatistics from './useStatistics';
import ChartStats from './ChartStats';
import Record from './Record';
import {styles} from './styles';
import LottieView from 'lottie-react-native';
import ViewShot from 'react-native-view-shot';
import * as Badges from '../../Assets/lottie';
import AnimatedBackground from '../../components/AnimatedBackground';
import {widthPercentageToDP} from 'react-native-responsive-screen';

const Statistics = ({navigation, route}) => {
  const {state, viewShotRef, onShareStats, getStats} = useStatistics(
    navigation,
    route,
  );
  const {last_unlocked, record_streaks} = state;
  const {params} = route;

  return (
    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
      <ViewShot ref={viewShotRef}>
        <AnimatedBackground animation={normal}>
          <PageHeading
            {...{title: params?.title, navigation, backButton: true}}
          />
          <View style={styles.container}>
            <View style={styles.subContainer}>
              <LottieView
                source={Badges[last_unlocked?.name]}
                style={{height: 150, width: widthPercentageToDP('70')}}
                autoPlay
                loop
              />
            </View>
            <Record {...state} />
            <View style={styles.padding}>
              <ShareButton
                {...{title: 'Share My Stats', onPress: onShareStats}}
              />
            </View>
            <ChartStats {...state} />
            <CalendarStats {...{record_streaks, onPress: getStats}} />
            <ShareButton
              {...{title: 'Share My Stats', onPress: onShareStats}}
            />
          </View>
        </AnimatedBackground>
      </ViewShot>
    </ScrollView>
  );
};

export default React.memo(Statistics);
