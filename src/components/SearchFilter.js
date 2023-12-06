import React, {useEffect, useState} from 'react';
import {Keyboard, Image, StyleSheet, Text, Dimensions} from 'react-native';
import {Colors, FontFamily, FontSize, Sizes} from '../theme/Variables';
import {Search} from '../Assets/Images';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {TouchableOpacity} from 'react-native-gesture-handler';
const window = Dimensions.get('window');

const SearchFilter = ({
  placeholder,
  onChange,
  value,
  isDisabled = false,
  onPress,
}) => {
  const [focus, setFocus] = useState(false);
  function onFocus() {
    onPress();
    setFocus(!focus);
  }
  useEffect(() => {
    const keyboardHide = Keyboard.addListener('keyboardDidHide', () => {
      setFocus(!focus);
      Keyboard.dismiss();
    });
    return () => {
      keyboardHide.remove();
    };
  }, []);

  return (
    <TouchableOpacity onPress={onPress} style={styles.textfield}>
      <Image
        source={Search}
        style={{
          resizeMode: 'contain',
          tintColor: Colors.white,
        }}
      />
      <Text style={styles.input}>Search</Text>
      {/* <TextInput
        onBlur={onFocus}
        onFocus={onFocus}
        {...{
          value,
          isDisabled,
          placeholder,
          keyboardType: 'default',
          style: styles.input,
          onChangeText: onChange,
          fontSize: FontSize.large,
          autoCapitalize: 'none',
          placeholderTextColor: Colors.white,
          editable: false,
        }}
      /> */}
    </TouchableOpacity>
  );
};

export default SearchFilter;

const styles = StyleSheet.create({
  label: {
    color: Colors.description,
    fontSize: FontSize.medium,
    fontFamily: FontFamily.regular,
  },
  textfield: {
    // width: '85%',
    borderRadius: 10,
    width: '100%',
    // borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderColor: Colors.white,
    // backgroundColor: 'red',
    // marginHorizontal: '5%',
    backgroundColor: Colors.blueMenu2,

    // justifyContent: 'space-between',
    // backgroundColor: Colors.searchFaded,
  },
  input: {
    height: 50,
    width: '80%',
    borderRadius: 10,
    textAlign: 'left',
    color: Colors.white,
    paddingHorizontal: heightPercentageToDP('3'),
    fontFamily: FontFamily.medium,
    justifyContent: 'center',
    textAlignVertical: 'center',
    paddingVertical: window.width * 0.04,
    // marginRight: widthPercentageToDP('2'),
    // paddingVertical: heightPercentageToDP('1.8'),
    // Platform.OS == 'android'
    //   ? heightPercentageToDP('1.5')
    //   : heightPercentageToDP('0'),
  },
  //   eyeContainer: {position: 'absolute', left: '2%', top: '38%'},
  description: {
    marginVertical: 5,
    color: Colors.placeholder,
    fontFamily: FontFamily.regular,
  },
  error: {
    color: '#FF4F40',
    fontFamily: FontFamily.regular,
  },
});
