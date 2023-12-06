import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors, FontFamily, FontSize} from '../theme/Variables';
import {contentTime, contentTimeWithOutSec} from '../utils/helper';
import {heightPercentageToDP} from 'react-native-responsive-screen';

const ContentDescription = ({data, audio}) => {
  return (
    <View style={styles.container}>
      {/* {!audio && (
        <Text numberOfLines={2} style={styles.contentTitle}>
          {data?.title}
        </Text>
      )} */}
      <View style={styles.artistList}>
        <Text numberOfLines={1} style={styles.type}>
          {data?.artist || 'unknown artist'}
        </Text>
        {audio ? null : (
          <Text numberOfLines={1} style={styles.duration}>
            {contentTimeWithOutSec(data?.duration)}
          </Text>
        )}
      </View>
    </View>
  );
};

export default ContentDescription;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  contentTitle: {
    textAlign: 'left',
    color: Colors.white,
    fontSize: FontSize.xlarge,
    fontFamily: FontFamily.medium,
  },
  artistList: {
    marginTop: 5,
    // flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
  },
  type: {
    textAlign: 'left',
    color: Colors.white2,
    fontSize: FontSize.regular,
    fontFamily: FontFamily.regular,
    marginVertical: heightPercentageToDP('2'),
  },
  duration: {
    color: Colors.white2,
    fontSize: FontSize.regular,
    fontFamily: FontFamily.regular,
  },
});
