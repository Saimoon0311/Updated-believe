import React, {useCallback} from 'react';
import {View, FlatList, Text} from 'react-native';
import {normal} from '../../Assets/lottie';
import LottieView from 'lottie-react-native';
import PageHeading from '../../components/PageHeading';
import useBadges from './useBadges';
import {styles} from './styles';
import Badge from '../../components/Badge';
import {keyExtractor} from '../../utils/helper';
import * as LottieBadges from '../../Assets/lottie';
import AnimatedBackground from '../../components/AnimatedBackground';
import {CompleteFirstSession} from '../../Assets/lottie/unlockAnimation';
import {widthPercentageToDP} from 'react-native-responsive-screen';

const Badges = ({navigation, route}) => {
  const {state, getBadges, navigateScreen} = useBadges(navigation, route);
  const {all_badges, last_unlocked} = state;
  const renderItem = useCallback(
    ({item, index}) =>
      item.name != 'SuggestibilityTest' &&
      item.name != 'ShareSocial' && (
        <Badge {...{item, index, onPress: navigateScreen}} />
      ),
    [all_badges],
  );

  return (
    <AnimatedBackground animation={normal}>
      <PageHeading {...{title: '', navigation, backButton: true}} />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <LottieView
            source={LottieBadges[last_unlocked?.name]}
            autoPlay
            style={{
              height: 220,
              // backgroundColor: 'red',
              width: widthPercentageToDP('60'),
            }}
            resizeMode="contain"
          />
          <View style={styles.badgeView}>
            <Text style={styles.activeBadge}>Last Earned Badge</Text>
            {/* <Text style={styles.detailBadge}>Samet Ipsum Dolor So</Text> */}
          </View>
        </View>
        <FlatList
          refreshing={false}
          numColumns={3}
          bounces={false}
          data={all_badges}
          onRefresh={getBadges}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1, alignItems: 'center'}}
          // ListEmptyComponent={
          //   <EmptyComponent
          //     title="Ooopss!"
          //     padding={true}
          //     description="Badges"
          //     // onRefresh={onRefresh}
          //   />
          // }
        />
      </View>
    </AnimatedBackground>
  );
};

export default React.memo(Badges);
