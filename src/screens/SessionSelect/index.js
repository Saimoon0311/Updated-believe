import React from 'react';
import {View, Text} from 'react-native';
import {normal} from '../../Assets/lottie';
import SelectionHeader from '../../components/SelectionHeader';
import DurationPicker from '../../components/DurationPicker';
import useSessionSelect from './useSessionSelect';
import NextButton from '../../components/NextButton';
import {styles} from './styles';
import AnimatedBackground from '../../components/AnimatedBackground';
import {heightPercentageToDP} from 'react-native-responsive-screen';

const seconds = Array.from(Array(60).keys()).map(val =>
  val < 10 ? `0${val}` : val,
);
const minutes = Array.from(Array(60).keys()).map(val =>
  val < 10 ? `0${val}` : val,
);
const hours = Array.from(Array(24).keys()).map(val =>
  val < 10 ? `0${val}` : val,
);

const SessionSelect = ({navigation, route}) => {
  const {setDuration, backFunction, duration, isGrater, durationRef} =
    useSessionSelect(navigation, route);
  const {header: title} = route?.params;
  console.log('duration', duration, durationRef.current);
  return (
    <AnimatedBackground animation={normal}>
      <SelectionHeader
        {...{title, navigation, backButton: true, backFunction}}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Duration</Text>

        <View style={styles.pickerContainer}>
          <DurationPicker
            value="hours"
            pickerData={hours}
            setDuration={setDuration}
            selectedValue={durationRef.current.hours}
          />
          <DurationPicker
            value="minutes"
            pickerData={minutes}
            setDuration={setDuration}
            selectedValue={durationRef.current.minutes}
          />
          <DurationPicker
            value="seconds"
            pickerData={seconds}
            setDuration={setDuration}
            selectedValue={durationRef.current.seconds}
          />
        </View>

        <Text
          style={{
            color: 'red',
            position: 'relative',
            // bottom: 44,
            top: heightPercentageToDP('-4'),
          }}>
          {isGrater ? 'Selected time is higher than session duration' : ''}
        </Text>

        <NextButton buttonTitle={'Done'} onPress={backFunction} />
      </View>
    </AnimatedBackground>
  );
};

export default React.memo(SessionSelect);
