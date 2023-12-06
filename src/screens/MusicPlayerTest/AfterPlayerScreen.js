import {normal} from '../../Assets/lottie';
import AnimatedBackground from '../../components/AnimatedBackground';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  Platform,
} from 'react-native';
import SafeView from '../../components/SafeView';
import SessionHeading from '../../components/SessionHeading';
import ViewShot from 'react-native-view-shot';
import StreakSection from '../Home/streakSection';
import ShareButton from '../../components/ShareButton';
import {shareStats} from '../../services/ShareStats';
import {store} from '../../store/store';
import {Colors, FontFamily} from '../../theme/Variables';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import BlurImage from '../../components/BlurImage';
import branch from 'react-native-branch';
import {
  downloaddarkBg,
  heartFilldarkBg,
  heartdarkBg,
  playlistBg,
  sharedarkBg,
} from '../../Assets/Images';
import {Touchable} from '../../components/Touchable';
import LottieView from 'lottie-react-native';
import * as LottieBadges from '../../Assets/lottie';
import API from '../../services/API';
import allStyle from './styles';
import {onShareFromApp} from '../../utils/helper';
import {triggerReview} from '../Me/useMe';

const AfterPlayerScreen = ({
  navigation,
  user,
  data,
  updateFavorite,
  onPlaylistOpen,
  isCompleted,
  checkFile,
  imageDownload,
  startDownload,
}) => {
  const viewShotRef = React.createRef(null);
  const {Content} = store.getState('Content');
  //   const {homeContent} = Content;
  const [homeContent, setHomeContent] = useState({
    total_spend_mints: 0,
    total_taken_session: 0,
    streaks: 0,
    badge: null,
  });

  const shareMusic = async () => {
    console.log(data);
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
    } catch (error) {
      console.log('onShare error', error);
    }
  };

  const getStateDate = async () => {
    const {ok, data} = await API.get('/get-unlocked-badge');
    console.log('badge =========>>>>>', data);
    if (ok) {
      setHomeContent({
        total_spend_mints: data.total_spend_mints,
        total_taken_session: data.total_taken_session,
        streaks: data.streaks,
        badge: data.badge?.name ?? null,
      });
      data.prompt && triggerReview();
    }
    setTimeout(() => {
      console.log('dhsvgbcnx zguybcx z', homeContent);
    }, 2000);
  };

  const useEffectFunc = () => {
    setTimeout(async () => {
      await getStateDate();
    }, 1500);
    // await getStateDate();
  };

  useEffect(useEffectFunc, []);
  const scrollViewRef = React.useRef(null);

  const bottomButtonArry = [
    {
      iconName: data?.is_favorite ? heartFilldarkBg : heartdarkBg,
      title: 'Favorite',
      onPress: updateFavorite,
    },
    {
      iconName: playlistBg,
      title: 'Playlist',
      onPress: onPlaylistOpen,
    },
    {
      iconName: downloaddarkBg,
      title: 'Download',
      onPress: startDownload,
      download: true,
    },
    {
      iconName: sharedarkBg,
      title: 'Share',
      onPress: shareMusic,
    },
  ];

  const BottomButton = ({item}) => {
    return (
      <Touchable onPress={() => item.onPress()} style={{alignItems: 'center'}}>
        {item.download ? (
          <>
            {isCompleted ? (
              <LottieView
                source={LottieBadges.tick}
                autoPlay
                resizeMode="cover"
                loop={false}
                style={{
                  width: widthPercentageToDP('10'),
                  height: heightPercentageToDP('8'),
                }}
              />
            ) : imageDownload ? (
              <LottieView
                source={LottieBadges.imageLoader}
                autoPlay
                resizeMode="cover"
                loop={true}
                style={{
                  width: widthPercentageToDP('10'),
                  height: heightPercentageToDP('6'),
                }}
              />
            ) : (
              !checkFile && (
                <Image
                  resizeMode="contain"
                  style={{
                    width: widthPercentageToDP('10'),
                    height: heightPercentageToDP('6'),
                  }}
                  source={item.iconName}
                  // style={styles.heartImage}
                />
              )
            )}
          </>
        ) : (
          <Image
            source={item?.iconName}
            resizeMode="contain"
            style={{
              width: widthPercentageToDP('10'),
              height: heightPercentageToDP('6'),
            }}
          />
        )}
        <Text style={{color: 'white', fontSize: 15}}>{item.title}</Text>
      </Touchable>
    );
  };

  const ViewA = () => {
    return (
      <View
        style={{
          width: '100%',
          // height: Dimensions.get('window').height * 0.8,
          // marginBottom:
          //   Platform.OS == 'android'
          //     ? heightPercentageToDP('5')
          //     : heightPercentageToDP('6'),
          // height:
          //   Platform.OS == 'ios'
          //     ? heightPercentageToDP('80')
          //     : heightPercentageToDP('90'),
        }}>
        <ViewShot
          ref={viewShotRef}
          style={{
            ...styles.steaksView,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          }}>
          <Text
            style={{
              fontSize: heightPercentageToDP('4'),
              color: Colors.white,
              textAlign: 'center',
              marginBottom: heightPercentageToDP('5'),
            }}>
            Congratulations
          </Text>
          {homeContent.badge && (
            <LottieView
              source={LottieBadges[homeContent.badge]}
              autoPlay
              style={{
                height: 200,
                width: widthPercentageToDP('70'),
                alignSelf: 'center',
                marginVertical: heightPercentageToDP('1'),
              }}
            />
          )}

          <StreakSection {...homeContent} />
        </ViewShot>
        <View
          style={{
            ...styles.steaksView,
            marginBottom: heightPercentageToDP('2'),
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
          }}>
          <ShareButton
            style={{
              width: '95%',
              alignSelf: 'center',
            }}
            title="Share My Stats"
            onPress={() => shareStats(viewShotRef)}
          />
        </View>
        {!user && (
          <ShareButton
            title="Unlock Believe Premium"
            style={{
              // width: '109%',
              alignSelf: 'center',
              marginBottom: heightPercentageToDP('2'),
            }}
            textStyle={{fontSize: heightPercentageToDP('2.1')}}
            onPress={() => navigation.navigate('Subscription')}
            // style={{marginBottom: heightPercentageToDP('5')}}
            hide={true}
          />
        )}
      </View>
    );
  };

  const ViewB = () => {
    return (
      // <View>
      <View
        style={{
          width: '95%',
          //   backgroundColor: 'yellow',
          paddingBottom: heightPercentageToDP('10'),
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 20, color: Colors.white}}>
          YOU'VE JUST COMPLETED
        </Text>

        <BlurImage
          uri={data?.cover_image}
          styles={styles.coverImage}
          blurhash={data?.cover_hash_code}
        />

        <Text style={{fontSize: 25, color: Colors.white}}>
          {data?.name || data?.title}
        </Text>
        <Text
          style={{
            fontSize: 20,
            color: Colors.white,
            marginTop: heightPercentageToDP('1'),
          }}>
          {data?.category?.name}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: widthPercentageToDP('80'),
            marginVertical: heightPercentageToDP('6'),
          }}>
          {bottomButtonArry.map(res => {
            return <BottomButton item={res} />;
          })}
        </View>
        {!user && (
          <ShareButton
            title="Unlock Believe Premium"
            style={{
              // width: '109%',
              alignSelf: 'center',
              // marginBottom: heightPercentageToDP('2'),
            }}
            textStyle={{fontSize: heightPercentageToDP('2.1')}}
            onPress={() => navigation.navigate('Subscription')}
            // style={{marginBottom: heightPercentageToDP('5')}}
            hide={true}
          />
        )}
      </View>
    );
  };

  return (
    <ViewShot>
      <AnimatedBackground animation={normal}>
        <SafeView>
          <SessionHeading {...{navigation, backButton: true}} />
          <ScrollView
            // ref={scrollViewRef}
            // pagingEnabled
            showsVerticalScrollIndicator={false}>
            <ViewShot
              style={[
                styles.container,
                {
                  height: 'auto',
                  justifyContent: 'center',
                  flex: 1,
                },
              ]}>
              <>
                <ViewA />
                <ViewB />
              </>
            </ViewShot>
          </ScrollView>
        </SafeView>
      </AnimatedBackground>
    </ViewShot>
  );
};

export default AfterPlayerScreen;

const styles = StyleSheet.create({
  container: {
    // height: '80%',
    marginHorizontal: '5%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    resizeMode: 'contain',
    backgroundColor: Colors.primaryColor,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    color: Colors.white,
    fontFamily: FontFamily.medium,
  },
  timer: {
    fontSize: 22,
    textAlign: 'center',
    paddingVertical: 15,
    color: Colors.white,
    fontFamily: FontFamily.regular,
  },
  count: {
    fontSize: 85,
    // fontSize: 48,
    textAlign: 'center',
    color: Colors.white,
    // paddingVertical: 10,
    fontFamily: FontFamily.light,
  },
  containers: {
    marginRight: 20,
    marginBottom: 20,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    top: 7.5,
    left: 5,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  steaksView: {
    backgroundColor: 'rgba(5,33,65,0.8)',
    // height: '25%',
    justifyContent: 'center',
    paddingVertical: 10,
    alignItems: 'center',
    overflow: 'hidden',
    // marginVertical: heightPercentageToDP('7'),
    // marginTop: heightPercentageToDP('3'),
    paddingBottom: heightPercentageToDP('2'),
  },
  playPauseButtonView: {
    alignItems: 'center',
    backgroundColor: Colors.blurWhite4,
    borderRadius: Math.round(
      Dimensions.get('window').width + Dimensions.get('window').height,
    ),
    width: Dimensions.get('window').width * 0.2,
    height: Dimensions.get('window').width * 0.2,
    justifyContent: 'center',
  },
  coverImage: {
    width: widthPercentageToDP('95'),
    height: heightPercentageToDP('25'),
    borderRadius: 10,
    marginVertical: heightPercentageToDP('2'),
  },
});
