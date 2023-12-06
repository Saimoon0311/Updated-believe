import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import {cloud, content, reward, sessions} from '../../Assets/Images';
import PageHeading from '../../components/PageHeading';
import useSubscription from './useSubscription';
import {normal} from '../../Assets/lottie';
import BadgeCard from '../../components/BadgeCard';
import {styles} from './styles';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AnimatedBackground from '../../components/AnimatedBackground';

const SubscribeAdd = ({navigation, route}) => {
  return (
    <AnimatedBackground animation={normal}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Unlock All the Content You Need!</Text>
        <View style={styles.mainContainer}>
          <View style={styles.badgeBox}>
            <BadgeCard
              {...{
                title: '500+ Content',
                icon: content,
              }}
            />
            <BadgeCard
              {...{
                title: 'Offline Content',
                icon: cloud,
              }}
            />
            <BadgeCard
              {...{
                title: 'Live Sessions',
                icon: sessions,
              }}
            />
            <BadgeCard
              {...{
                title: 'Double Rewards',
                icon: reward,
              }}
            />
          </View>
        </View>

        <Text style={styles.planHeading}>Select Your Plan</Text>

        <View style={styles.bottom}>
          <Text style={styles.cancelHeading}>
            Restore Purchase | Terms of Use | Billings Details
          </Text>
        </View>
      </ScrollView>
    </AnimatedBackground>
  );
};

export default React.memo(SubscribeAdd);
