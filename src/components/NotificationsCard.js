import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {Colors, FontFamily, FontSize, Sizes} from '../theme/Variables';
import {Touchable} from '../components/Touchable';
import LottieView from 'lottie-react-native';
import * as LottieBadges from '../Assets/lottie';
import {email, notificationAll, notifications} from '../Assets/Images';
import moment from 'moment';
import {timeLayout} from '../utils/helper';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

const NotificationsCard = ({item, onPress}) => {
  return (
    <View
      style={{
        paddingTop: heightPercentageToDP('2'),
      }}>
      <Touchable Opacity={0.7} onPress={onPress} style={styles.listView}>
        <View style={styles.row}>
          {item?.achievement_details?.name ? (
            <LottieView
              source={LottieBadges[item?.achievement_details?.name]}
              autoPlay
              style={{height: 50, width: widthPercentageToDP('12')}}
            />
          ) : (
            <Image source={notificationAll} style={styles.album} />
          )}
          <View style={styles.artistList}>
            <View style={styles.rowEnd}>
              <Text numberOfLines={1} style={styles.name}>
                {item?.title}
              </Text>
              <Text style={styles.time}>{timeLayout(item.created_at)}</Text>
            </View>
            <View style={styles.bottomPara}>
              <Text numberOfLines={4} style={styles.description}>
                {item?.achievement_details?.description ?? item?.body}
              </Text>
            </View>
          </View>
        </View>
      </Touchable>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          height: heightPercentageToDP('0.03'),
          marginTop: heightPercentageToDP('2'),
        }}
      />
    </View>
  );
};

export default React.memo(NotificationsCard);

const styles = StyleSheet.create({
  listView: {
    // height: 70,
    // marginBottom: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    // alignItems: 'center',
  },
  album: {
    width: 50,
    height: 50,
    // borderRadius: 10,
  },
  artistList: {
    width: '82.5%',
    marginTop: 3,
    marginLeft: widthPercentageToDP('2'),
  },
  rowEnd: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  name: {
    textAlign: 'left',
    color: Colors.white,
    fontSize: FontSize.xlarge,
    fontFamily: FontFamily.medium,
  },
  bottomPara: {
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  description: {
    width: '77.5%',
    textAlign: 'left',
    color: Colors.white,
    fontSize: FontSize.xlarge,
    fontFamily: FontFamily.light,
  },
  time: {
    textAlign: 'right',
    color: Colors.white,
    fontSize: FontSize.large,
    fontFamily: FontFamily.light,
    width: widthPercentageToDP('30'),
    // backgroundColor: 'green',
    paddingLeft: widthPercentageToDP('10'),
    // alignSelf: 'flex-end',
  },
});
