import {background} from '../Assets/Images';
import React, {useState} from 'react';
import {View} from 'react-native';
import {Blurhash} from 'react-native-blurhash';
import FastImage from 'react-native-fast-image';
import useReduxStore from '../hooks/useReduxStore';

const BlurImage = ({styles, uri, blurhash, radius, children}) => {
  const {getState} = useReduxStore();
  const {token} = getState('Auth');
  const [load, setLoad] = useState(true);
  const imageSource = uri
    ? {
        uri,
        priority: FastImage.priority.high,
        headers: {authorization: token},
        cache: FastImage.cacheControl.immutable,
      }
    : background;
  return (
    <View
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: radius || 10,
      }}>
      <FastImage
        style={[styles, {zIndex: -1, position: 'relative'}]}
        source={imageSource}
        onLoad={() => setLoad(false)}
        onLoadStart={() => setLoad(true)}
      />
      {load && (
        <Blurhash
          shouldRasterizeIOS
          blurhash={blurhash || 'LTG*j6E0~VnLxV?ZMw%05P-pNZWB'}
          style={[styles, {zIndex: 1, position: 'absolute'}]}
        />
      )}
      {children}
    </View>
  );
};

export default React.memo(BlurImage);
