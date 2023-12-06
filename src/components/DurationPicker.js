import React from 'react';
import {Colors} from '../theme/Variables';
import {StyleSheet, Text} from 'react-native';
import ScrollPicker from 'react-native-wheel-scrollview-picker';

const DurationPicker = ({
  value: pick,
  pickerData,
  setDuration,
  selectedValue,
}) => {
  const onWheelChange = (value, index) => {
    console.log('sjdbfjksbdjkvbskdjbvsbdv', value);
    setDuration(prev => ({
      ...prev,
      [pick]: Number(value),
    }));
  };
  console.log(
    'pickpickpickpickpickpickpick',
    pick,
    selectedValue,
    pickerData?.indexOf(selectedValue),
  );

  const renderItem = (data, index) => (
    <Text style={[styles.text, {right: 0}]}>{data}</Text>
  );
  return (
    <>
      <ScrollPicker
        dataSource={pickerData}
        selectedIndex={selectedValue}
        renderItem={renderItem}
        onValueChange={onWheelChange}
        wrapperHeight={280}
        wrapperColor="transparent"
        itemHeight={50}
        highlightColor="rgba(255,255,255,.3)"
        highlightBorderWidth={1}
        wrapperBackground="transparent"
      />
      <Text style={styles.text}>{pick[0]}</Text>
    </>
  );
};

export default DurationPicker;

const styles = StyleSheet.create({
  picker: {
    width: 90,
    backgroundColor: Colors.transparent,
  },
  text: {
    right: 20,
    fontSize: 22,
    textAlign: 'left',
    color: Colors.white,
  },
});
