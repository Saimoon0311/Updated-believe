import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {back, download, favorite, unFavorite, upload} from '../Assets/Images';
import {Colors, FontFamily} from '../theme/Variables';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import Entypo from 'react-native-vector-icons/Entypo';
import LottieView from 'lottie-react-native';
import {imageLoader, tick} from '../Assets/lottie';
import * as Progress from 'react-native-progress';
import branch from 'react-native-branch';
import {onShareFromApp} from '../utils/helper';

const ContentFavorite = ({
  data,
  onPress,
  navigation,
  isSeries,
  isDownload,
  isCompleted,
  startDownload,
  progressVlaue,
  cancelDownloadFun,
  checkFile,
  imageDownload,
}) => {
  const shareMusic = async () => {
    try {
      const branchUniversalObject = await branch.createBranchUniversalObject(
        `${data?.type || ''}/content/${data?.id}`,
        {
          locallyIndex: true,
          title: data?.title,
          contentDescription: data?.description,
          contentImageUrl: data?.image || data?.cover_image,
          contentMetadata: {
            customMetadata: {
              content_data: JSON.stringify(data),
            },
          },
        },
      );

      const linkProperties = {
        feature: 'share',
        channel: 'content_share',
      };

      const controlParams = {
        $desktop_url: 'https://believehypnosis.app/',
        $ios_url: 'https://apps.apple.com/us/app/believe-hypnosis/id6466321566',
        $android_url:
          'https://play.google.com/store/apps/details?id=com.hyptalk.believe',
      };

      let {channel, completed, error} =
        await branchUniversalObject.showShareSheet(
          {},
          linkProperties,
          controlParams,
        );
      if (error == null) onShareFromApp('Influencer');
      console.log('dsfsfsfsfsf', channel, completed, error);
    } catch (error) {
      console.log('onShare error', error);
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.button}
        onPress={() => navigation.goBack()}>
        <Image source={back} resizeMode="contain" style={styles.back} />
      </TouchableOpacity>
      {/* <Text numberOfLines={1} style={styles.heading}>
  {data?.name}
</Text> */}
      <View
        style={{
          flexDirection: 'row',
          marginRight: widthPercentageToDP('-6'),
          alignItems: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          disabled={Boolean(isSeries)}
          style={styles.icon(isSeries)}
          onPress={shareMusic}
          // onPress={onPress}
        >
          <Image source={upload} resizeMode="contain" style={styles.back} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          disabled={Boolean(isSeries)}
          style={{
            ...styles.icon(isSeries),
            marginRight: widthPercentageToDP('3'),
          }}
          // onPress={shareMusic}
          onPress={onPress}>
          <Image
            source={data?.is_favorite ? favorite : unFavorite}
            resizeMode="contain"
            style={styles.back}
            // style={styles.heartImage}
          />
        </TouchableOpacity>
        {isDownload ? (
          <View style={styles.icon(false)}>
            <Progress.Circle
              unfilledColor={'white'}
              color={Colors.greenFaded}
              borderWidth={0}
              progress={progressVlaue / 100}
              size={30}>
              <Entypo
                name="cross"
                color={'white'}
                onPress={cancelDownloadFun}
                size={heightPercentageToDP('2.5')}
                style={{
                  position: 'absolute',
                  top: heightPercentageToDP('0.5'),
                  left: widthPercentageToDP('1'),
                }}
              />
            </Progress.Circle>
          </View>
        ) : isCompleted ? (
          <LottieView
            source={tick}
            autoPlay
            resizeMode="cover"
            loop={false}
            style={[
              styles.icon(isSeries),
              {
                marginLeft:
                  Platform.OS == 'ios'
                    ? widthPercentageToDP('-3.5')
                    : widthPercentageToDP('-5'),
                height: heightPercentageToDP('12'),
                marginRight: widthPercentageToDP('2'),
                marginTop: Platform.OS == 'ios' ? heightPercentageToDP('2') : 0,
              },
            ]}
          />
        ) : imageDownload ? (
          <LottieView
            source={imageLoader}
            autoPlay
            resizeMode="cover"
            loop={true}
            style={[
              styles.icon(false),
              {
                marginLeft:
                  Platform.OS == 'ios'
                    ? widthPercentageToDP('-3')
                    : widthPercentageToDP('-5'),
                // marginRight: widthPercentageToDP('1'),
                marginTop:
                  Platform.OS == 'ios' ? heightPercentageToDP('0.7') : 0,
                height: heightPercentageToDP('5.5'),
              },
            ]}
          />
        ) : (
          !checkFile && (
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.icon,
                {
                  marginRight: widthPercentageToDP('4'),
                  alignItems: 'center',
                  marginLeft: widthPercentageToDP('-3'),
                  justifyContent: 'center',
                },
              ]}
              onPress={startDownload}>
              <Image
                resizeMode="contain"
                style={styles.back}
                source={download}
                // style={styles.heartImage}
              />
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );
};

export default ContentFavorite;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: '5%',
    justifyContent: 'space-between',
  },
  heading: {
    width: '80%',
    fontSize: 18,
    textAlign: 'center',
    color: Colors.white,
    paddingVertical: 20,
    fontFamily: FontFamily.medium,
  },
  icon: isSeries => ({
    width: widthPercentageToDP('13'),
    height: 50,
    justifyContent: 'center',
    // alignItems: 'f',
    opacity: isSeries ? 0 : 1,
  }),
  back: {
    width: widthPercentageToDP('10'),
    height: heightPercentageToDP('10'),
  },
  button: {
    // width: 50,
    // height: 50,
    justifyContent: 'center',
  },
  heartImage: {height: 20, width: 20, resizeMode: 'contain'},
});
