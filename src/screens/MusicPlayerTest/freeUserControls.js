import React from 'react';
import {ArryControls} from './arryControls';
import {ObjectControls} from './objectControls';

export const FreeUserControls = ({
  checkParamsType,
  infoRef,
  previousAudio,
  setSound,
  play,
  nextAudio,
  onPlaylistOpen,
  isSeries,
  index,
  runOnLoop,
  loop,
  isPlayAble,
  backwardAudio,
  forwardAudio,
}) => {
  return checkParamsType ? (
    <ArryControls
      {...{
        infoRef,
        previousAudio,
        setSound,
        play,
        nextAudio,
        onPlaylistOpen,
        isSeries,
        index,
        runOnLoop,
        loop,
        isPlayAble,
        free: true,
      }}
    />
  ) : (
    <ObjectControls
      {...{
        infoRef,
        backwardAudio,
        forwardAudio,
        // backwardAudio: () => {
        //   console.log('skjdbhgjsbdlgkjbdsv');
        // },
        // forwardAudio: () => {
        //   console.log('ertyuioiuygf');
        // },
        setSound,
        play,
        onPlaylistOpen,
        isSeries,
        index,
        free: true,
      }}
    />
  );
};
