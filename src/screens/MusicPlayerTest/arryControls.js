import {
  autoplay,
  help,
  noLoop,
  pauseButton,
  playButton,
} from '../../Assets/Images';
import {Touchable} from '../../components/Touchable';
import React from 'react';
import {Image, View} from 'react-native';
import Foundation from 'react-native-vector-icons/Foundation';
import {styles} from './styles';

export const ArryControls = ({
  infoRef,
  setSound,
  play,
  index,
  previousAudio,
  nextAudio,
  runOnLoop,
  isPlayAble,
  loop,
}) => {
  return (
    <View style={styles.controllers}>
      <Touchable
        style={styles.buttonSmall}
        onPress={() => infoRef.current.open()}
        Opacity={0.7}>
        <Image style={styles.cornerButton} source={help} />
      </Touchable>
      <View style={styles.center}>
        <Foundation
          Opacity={0.7}
          onPress={() => previousAudio(index)}
          name="previous"
          style={styles.buttonMedium}
        />
        <Touchable Opacity={0.7} style={styles.button} onPress={setSound}>
          <Image
            style={styles.playerButton}
            source={play ? pauseButton : playButton}
          />
        </Touchable>
        <Foundation
          Opacity={0.7}
          onPress={() => nextAudio(index)}
          name="next"
          style={styles.buttonMedium}
        />
      </View>
      <Touchable
        style={{...styles.buttonSmall, backgroundColor: 'transparent'}}
        disabled={!isPlayAble}
        Opacity={0}
        onPress={runOnLoop}>
        <Image
          style={{...styles.cornerButton, opacity: 0}}
          source={loop ? autoplay : noLoop}
        />
      </Touchable>
    </View>
  );
};
