import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, StyleSheet, Keyboard} from 'react-native';
import {Controller} from 'react-hook-form';
import {Colors, FontFamily, FontSize, Sizes} from '../theme/Variables';

const InputName = ({
  minLength,
  placeholder,
  isRequired,
  control,
  name,
  errors,
  type,
  defaultValue = '',
  isDisabled = false,
}) => {
  const keyboardType = ['phone', 'reset_code'].includes(name)
    ? 'numeric'
    : 'default';
  const [focus, setFocus] = useState(false);
  function onFocus() {
    setFocus(true);
  }
  function onBlur() {
    setFocus(false);
  }

  useEffect(() => {
    const keyboardHide = Keyboard.addListener('keyboardDidHide', () => {
      setFocus(false);
      Keyboard.dismiss();
    });
    return () => {
      keyboardHide.remove();
    };
  }, []);

  return (
    <>
      <Controller
        render={({field: {onChange, value}}) => (
          <View style={styles.textfield}>
            <TextInput
              onBlur={onBlur}
              onFocus={onFocus}
              type={type}
              {...{
                value,
                isDisabled,
                placeholder,
                keyboardType,
                style: styles.input,
                onChangeText: onChange,
                autoCapitalize: 'none',
                fontSize: FontSize.large,
                selectionColor: Colors.white,
                placeholderTextColor: Colors.white,
              }}
            />
          </View>
        )}
        {...{
          name,
          control,
          defaultValue,
          rules: {required: Boolean(isRequired), minLength},
        }}
      />
      {errors[name]?.message && (
        <View
          style={{
            // width: Platform.OS == 'ios' ? width * 0.875 : Sizes.width * 0.9,
            width: Sizes.width * 0.9,
          }}>
          <Text
            style={[
              styles.error,
              {
                fontSize: FontSize.default,
              },
            ]}>
            {errors[name]?.message}
          </Text>
        </View>
      )}
    </>
  );
};

export default InputName;

const styles = StyleSheet.create({
  label: {
    color: Colors.label,
    fontSize: FontSize.default,
    fontFamily: FontFamily.regular,
  },
  textfield: {
    width: '100%',
    marginVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Colors.white,
    justifyContent: 'space-between',
  },
  input: {
    height: 50,
    width: '100%',
    borderRadius: 10,
    textAlign: 'left',
    color: Colors.white,
    paddingHorizontal: 10,
    fontFamily: FontFamily.regular,
  },
  description: {
    marginVertical: 5,
    color: Colors.placeholder,
    fontFamily: FontFamily.regular,
  },
  error: {
    color: Colors.redFade,
    fontFamily: FontFamily.regular,
  },
});
