import React from 'react';
import {View} from 'react-native';
import FadeCard from '../../components/FadeCard';
import Heading from '../../components/Headings';
import UpgradeCard from '../../components/UpgradeCard';
import Bar from '../../components/Bar';
import {styles} from './styles';
import {barCard, upgradeCard} from '../../utils/helper/LocalDb';

const End = ({
  viewAll,
  playAudio,
  new_libraries,
  recent_played,
  viewMeditation,
  viewSubscription,
  popular_libraries,
  isSubscript,
}) => {
  return (
    <>
      <View style={styles.topPadding}>
        <Heading
          {...{
            viewAll,
            view: true,
            title: `What's Popular`,
            data: popular_libraries,
            requestParam: 'all-popular-audios',
          }}
        />
      </View>
      <FadeCard
        {...{
          popular: true,
          onPress: playAudio,
          data: popular_libraries,
        }}
      />
      <Heading
        {...{
          viewAll,
          view: true,
          title: `What’s New`,
          data: new_libraries,
          requestParam: 'all-new-audios',
        }}
      />
      <FadeCard
        {...{
          newData: true,
          onPress: playAudio,
          data: new_libraries,
        }}
      />
      <Bar {...{item: barCard, title: `Reminders`, viewMeditation}} />
      <Heading
        {...{
          viewAll,
          view: true,
          title: 'Recently Played',
          data: recent_played,
          requestParam: 'all-recently-played',
        }}
      />
      {/* <RecentCard {...{data: recent_played, view: true, onPress: playAudio}} /> */}
      <FadeCard
        {...{
          newData: true,
          onPress: playAudio,
          data: recent_played,
        }}
      />
      {/* {Boolean(upcoming_events?.length) && (
        <>
          <Heading {...{title: `Upcoming Live Events`}} />
          <EventCard {...{data: upcoming_events}} />
        </>
      )} */}
      <View style={styles.verticalPadding}>
        {!isSubscript && (
          <UpgradeCard {...{data: upgradeCard, onPress: viewSubscription}} />
        )}
      </View>
    </>
  );
};

export default End;
