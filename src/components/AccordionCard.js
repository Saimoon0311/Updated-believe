import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {Colors, FontFamily, FontSize} from '../theme/Variables';
import * as images from '../Assets/Images';
import SubscribeCheck from './SubscribeCheck';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

const AccordionCard = ({item, onPress}) => {
  return (
    <SubscribeCheck style={styles.listView} item={item} onPress={onPress}>
      {console.log('ss', item)}
      <View style={styles.container}>
        <View>
          <Text numberOfLines={2} style={styles.title}>
            {item?.title}
          </Text>
        </View>
        <View style={styles.topRow}>
          <Image source={images[item?.type]} style={styles.album} />
          <View style={styles.artistList}>
            <Text numberOfLines={1} style={styles.type}>
              {item?.type}
            </Text>
            <Text numberOfLines={1} style={styles.duration}>
              {item?.time}
            </Text>
          </View>
        </View>
      </View>

      {item.check_status && item.isSelfHypnosisCourse && (
        <View style={styles.checkIcons}>
          {/* <Icon name="check" size={30} color="#DEDEDE" /> */}
          <Image
            source={images['correct']}
            style={styles.correct}
            resizeMode="contain"
          />

          {/* <Icon name="close" size={30} color="red" /> */}
        </View>
      )}
      {/* {item.check_status == null && item.isSelfHypnosisCourse && checkType && (
        <View style={styles.checkIcons}>
          <Image
            source={images['incorrect']}
            style={styles.correct}
            resizeMode="contain"
          />
        </View>
      )} */}
    </SubscribeCheck>
  );
};

export default React.memo(AccordionCard);

const styles = StyleSheet.create({
  listView: {
    width: '100%',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  container: {
    width: '90%',
    marginTop: -10,
  },
  album: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: Colors.white2,
  },
  artistList: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    textAlign: 'left',
    color: Colors.white2,
    fontSize: FontSize.large,
    fontFamily: FontFamily.regular,
  },
  topRow: {
    marginTop: 10,
    flexDirection: 'row',
  },
  type: {
    textAlign: 'left',
    color: Colors.white2,
    textTransform: 'uppercase',
    fontSize: FontSize.default,
    fontFamily: FontFamily.regular,
    opacity: 0,
  },
  duration: {
    paddingLeft: 2.5,
    marginTop: '1.5%',
    textAlign: 'left',
    color: Colors.white2,
    fontSize: FontSize.medium,
    fontFamily: FontFamily.regular,
  },
  status: {
    color: Colors.white2,
    textAlign: 'center',
    fontSize: FontSize.medium,
    fontFamily: FontFamily.medium,
  },
  line: {
    opacity: 0.5,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.bottomLine,
  },
  checkIcons: {
    marginTop: -3,
  },
  correct: {
    resizeMode: 'contain',
    width: widthPercentageToDP('6'),
    height: heightPercentageToDP('3'),
    // backgroundColor: 'red',
  },
});
