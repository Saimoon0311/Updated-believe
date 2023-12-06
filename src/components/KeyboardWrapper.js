import React from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const KeyBoardWrapper = ({children}) => (
  <KeyboardAwareScrollView
    showsVerticalScrollIndicator={false}
    bounces={false}
    // keyboardShouldPersistTaps={'always'}
    contentContainerStyle={{flexGrow: 1}}>
    {children}
  </KeyboardAwareScrollView>
);

export default KeyBoardWrapper;
