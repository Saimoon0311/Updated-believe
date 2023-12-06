import React from 'react';
import {StyleSheet, Image, View} from 'react-native';
import {Colors, FontFamily} from '../../theme/Variables';
import {Calendar} from 'react-native-calendars';
import {left, right} from '../../Assets/Images';
import moment from 'moment/moment';

const IconLeft = () => {
  return (
    <View style={styles.left}>
      <Image source={left} />
      <Image source={left} />
    </View>
  );
};
const IconRight = () => {
  return (
    <View style={styles.right}>
      <Image source={right} />
      <Image source={right} />
    </View>
  );
};
const CalendarStats = ({record_streaks, onPress}) => {
  // const validData = {};
  // record_streaks?.forEach(date => {
  //   validData[moment(date).format('YYYY-MM-DD')] = {
  //     customStyles: styles.customStyles,
  //     selected: true,
  //   };
  // });

  const validData = record_streaks.map(dateString => {
    console.log(
      "moment(dateString).format('YYYY-MM-DD')moment(dateString).format('YYYY-MM-DD')",
      moment(dateString).format('YYYY-MM-DD'),
      record_streaks,
    );
    return {
      [moment(dateString).format('YYYY-MM-DD')]: {
        // [new Date(dateString).toLocaleTimeString()]: {
        customStyles: styles.customStyles,
        selected: true,
      },
    };
  });
  const mergedData = validData.reduce((accumulator, currentDateObj) => {
    return {...accumulator, ...currentDateObj};
  }, {});

  // const validData = {};
  // record_streaks?.forEach(date => {
  //   console.log('sdbkjsbdkjvbsdjbsjkvbsdkvsd', date);
  //   validData[new Date(date).toLocaleDateString('en-CA')] = {
  //     customStyles: styles.customStyles,
  //     selected: true,
  //   };
  // });

  console.log('validDatavalidDatavalidDatavalidData', mergedData);
  return (
    <View style={{marginBottom: 20}}>
      <Calendar
        theme={styles.theme}
        markingType={'custom'}
        headerStyle={styles.headerStyles}
        style={styles.calendar}
        renderArrow={direction =>
          direction === 'left' ? <IconLeft /> : <IconRight />
        }
        markedDates={mergedData}
      />
    </View>
  );
};

export default React.memo(CalendarStats);

const styles = StyleSheet.create({
  calendar: {
    width: '100%',
    backgroundColor: Colors.transparent,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 60,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 60,
  },
  headerStyles: {
    backgroundColor: Colors.transparent,
  },
  theme: {
    textDayFontSize: 16,
    textMonthFontSize: 20,
    textSectionTitleColor: Colors.blurWhite,
    textSectionTitleDisabledColor: Colors.blurWhite,
    textDayFontFamily: FontFamily.light,
    textMonthFontFamily: FontFamily.bold,
    textColor: Colors.red,
    arrowColor: Colors.white,
    dayTextColor: Colors.blurWhite,
    todayTextColor: Colors.blurWhite,
    monthTextColor: Colors.white,
    agendaDayTextColor: Colors.blurWhite,
    backgroundColor: Colors.transparent,
    textDisabledColor: Colors.transparent,
    textDisabledColor: Colors.lightGray,
    calendarBackground: Colors.transparent,
    textSectionTitleDisabledColor: Colors.blurWhite,
    selectedDayBackgroundColor: Colors.transparent,
  },
  customStyles: {
    container: {
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: Colors.greenFaded,
      backgroundColor: Colors.fadeGreen,
    },
    text: {
      fontSize: 16,
      color: Colors.white,
      fontFamily: FontFamily.light,
    },
  },
});
