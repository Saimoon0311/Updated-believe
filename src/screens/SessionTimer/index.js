import React, {PureComponent, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  BackHandler,
  ScrollView,
  Platform,
  TaskProvider,
} from 'react-native';
import TrackPlayer, {
  RepeatMode,
  useTrackPlayerEvents,
  TrackPlayerEvents,
  State,
  Capability,
} from 'react-native-track-player';
import * as Images from '../../Assets/Images';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import SessionHeading from '../../components/SessionHeading';
import BlurBackground from '../../components/BlurBackground';
import {Touchable} from '../../components/Touchable';
import SafeView from '../../components/SafeView';
import {
  contentTime,
  getCurrentTimeWithFormat,
  musicSwitch,
} from '../../utils/helper';
import {Colors} from '../../theme/Variables';
import {styles} from './styles';
import ShareButton from '../../components/ShareButton';
import {connect} from 'react-redux';
import {playMusic} from '../../store/actions/music-action';
import {getValue} from '../../services/storage';
import StreakSection from '../Home/streakSection';
import {store} from '../../store/store';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import ViewShot from 'react-native-view-shot';
import LottieView from 'lottie-react-native';
import * as LottieBadges from '../../Assets/lottie';
import API from '../../services/API';
import {shareStats} from '../../services/ShareStats';
import BackgroundTimer from 'react-native-background-timer';
import KeepAwake from 'react-native-keep-awake';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import BackgroundTask from 'react-native-background-task';

export class SessionTimer extends PureComponent {
  constructor(props) {
    super(props);
    this.viewShotRef = React.createRef();
    this.state = {
      isPlaying: false,
      isComplete: false,
      bell: false,
      animation: false,
      badgeData: [],
      medBedge: false,
      isFirst: false,
      homeContent: {
        total_spend_mints: 0,
        total_taken_session: 0,
        streaks: 0,
        badge: null,
      },
    };
  }

  /** The above code is checking if the value of the 'background' variable is equal to the string 'true'.
It then converts the result to a boolean value and assigns it to the 'checkbg' variable. **/
  checkbg = Boolean(getValue('background') == 'true');

  /** The above code is defining an asynchronous function called `getBadges`. Inside the function, it is
making an API request to a route `/get-all-achievements` using the `API.get` method. It is then
checking if the response is successful (`ok` is true) and if so, it is updating the state of the
component with the received data. If there is an error, it is logging the error to the console. **/
  getBadges = async () => {
    try {
      const {ok, data} = await API.get('/get-all-achievements');
      if (ok) this.setState({badgeData: data});
    } catch (error) {
      console.log(error, 'error');
    }
  };

  /** The above code is defining an asynchronous function called `getCurrentTrackNum` in JavaScript.
  This function uses the `await` keyword to wait for the `TrackPlayer.getActiveTrackIndex()`
  function to complete and return a value. The `TrackPlayer.getActiveTrackIndex()` function is
  likely a part of a music player library or API and is used to get the index of the currently
  playing track. **/
  getCurrentTrackNum = async () => await TrackPlayer.getCurrentTrack();

  /** The above code is defining an asynchronous function called `initializeTrack` that takes a parameter
`dataTrack`. Inside the function, it uses the `await` keyword to wait for the `TrackPlayer.add`
function to complete, passing in the `dataTrack` parameter. Then, it waits for the
`TrackPlayer.setRepeatMode` function to complete, passing in the `RepeatMode.Off` parameter. If any
errors occur during this process, it logs the error message to the console. **/
  initiliazeTrack = async dataTrack => {
    console.log('dataTrackdataTrackdataTrackdataTrackdataTrack', dataTrack);
    try {
      const p = await TrackPlayer.add(dataTrack);
      console.log('pppppppppppppppppppp', p);
      await TrackPlayer.setRepeatMode(RepeatMode.Off);
      await TrackPlayer.updateOptions({
        stopWithApp: true,
        capabilities: [Capability.Play, Capability.Pause, Capability.Stop],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.Stop,
        ],
      });
      console.log('inintitiuu');
    } catch (error) {
      let e = error;
      if (
        e.toString() ==
        'Error: The player has already been initialized via setupPlayer.'
      ) {
        initiliazePlayerAfterError(dataTrack);
      } else {
        await TrackPlayer.setupPlayer();
        initiliazePlayerAfterError(dataTrack);
      }
    }
  };

  /** The above code is a JavaScript function that initializes a player after an error occurs. It uses
  the TrackPlayer library to set up the player, add a track, set repeat mode, update options, and
  play or pause the track based on the provided parameters. If an error occurs during this process,
  it logs the error, navigates back, and shows an error message. **/
  initiliazePlayerAfterError = async dataTrack => {
    try {
      const p = await TrackPlayer.add(dataTrack);
      console.log('pppppppppppppppppppp', p);
      await TrackPlayer.setRepeatMode(RepeatMode.Off);
      await TrackPlayer.updateOptions({
        stopWithApp: true,
        capabilities: [Capability.Play, Capability.Pause, Capability.Stop],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.Stop,
        ],
      });
      console.log('inintitiuu');
    } catch (error) {
      console.log('ldsvskjdbvkjsdbvsbdkvbsdkbvsdbvkjsdbvkjdsb', error);
    }
  };

  /** The above code is defining an asynchronous function called `destroyThePlayer`. Inside this function,
it is using the `await` keyword to wait for the `TrackPlayer.reset()` function to complete before
moving on to the next line of code. **/

  destroyThePlayer = async () => {
    console.log('hjkbdvjksbdjkbdjkbvdjbv jbvjsd');
    await TrackPlayer.reset();
    // num = await this.getCurrentTrackNum();
    // await TrackPlayer.remove(num);
  };

  /**
   * The `componentDidMount` function is an asynchronous function that is called when a component is
   * mounted, and it performs various tasks such as activating the KeepAwake feature, making an API post
   * request, setting up music player options, and initializing a track.
   **/
  async componentDidMount() {
    // this.checkbg && (await this.props.appMusic(false));
    // this.checkbg && (await musicSwitch(false));
    const {navigation, route} = this.props;
    await this.initiliazeTrack(route?.params?.startBell);
    KeepAwake.activate();
    await API.post('/count-streak', {
      current_date: getCurrentTimeWithFormat(),
      meditator: true,
    });
    this.getBadges();
    // const checkbg = Boolean(getValue('background') == 'true');

    // !this.checkbg && (await TrackPlayer.setupPlayer());
    this.gestureEnd = navigation.addListener('gestureEnd', async () => {
      if (Platform.OS == 'android') this.destroyThePlayer();
      if (Platform.OS == 'ios') {
        await TrackPlayer.updateOptions({stopWithApp: true});
        await TrackPlayer.reset();
        // await TrackPlayer.destroy();
      }
    });

    /** The above code is registering a hardware back press event listener in a JavaScript application. When
the back button is pressed, it checks the platform (Android or iOS) and performs different actions
accordingly. **/
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      async () => {
        if (Platform.OS == 'android') this.destroyThePlayer();
        if (Platform.OS == 'ios') {
          await TrackPlayer.updateOptions({stopWithApp: true});
          await TrackPlayer.reset();
        }
      },
    );
    console.log(
      'route?.params?.startBellroute?.params?.startBellroute?.params?.startBellroute?.params?.startBell',
      route?.params?.startBell,
    );

    console.log('jbdjkbcklbdvklds', await TrackPlayer.getCurrentTrack());
    // setTimeout(async () => {
    //   console.log('jbdjkbcklbdvklds', await TrackPlayer.getActiveTrack());
    // }, 100);
  }

  /**
   * The `componentWillUnmount` function is used to clean up resources and perform necessary actions
   * before a component is unmounted.
   **/
  async componentWillUnmount() {
    const val = await AsyncStorage.getItem('background');
    if (Platform.OS == 'android') this.destroyThePlayer();
    if (Platform.OS == 'ios') {
      await TrackPlayer.updateOptions({stopWithApp: true});
      await TrackPlayer.reset();
      // await TrackPlayer.destroy();
    }
    this.backHandler.remove();
    // Platform.OS == 'android' && (await TrackPlayer.remove(num));
    if (this.checkbg) {
      // Platform.OS == 'ios' && (await TrackPlayer.setupPlayer());
      musicSwitch(val);
      // this.props.appMusic(getValue('background') == 'true');
    }
    this.gestureEnd();
  }

  /** The above code is defining an asynchronous function called `ringTheEndBell`. This function is used
to play a sound when a certain event occurs. **/
  ringTheEndBell = async () => {
    const {endBell} = this.props.route?.params;
    await TrackPlayer.reset();
    this.initiliazeTrack(endBell);
    TrackPlayer.play();
    this.setSound();
  };

  /** The above code is defining a function called `completeHandler` in JavaScript. **/
  completeHandler = async () => {
    const {ok, data} = await API.post('/med-timer', {});
    console.log('datafdsfzdfsdfds', data);
    if (ok) this.setState({medBedge: data});

    this.setState({isComplete: true});
    this.animation?.play();

    // this.closeAudio();
  };
  /** The above code is defining a function called `setSound` in JavaScript. **/
  setSound = async () => {
    const {bell, isPlaying} = this.state;
    // const {navigation, route} = this.props;
    if (!bell && !isPlaying) {
      // await this.initiliazeTrack(route?.params?.startBell);
      TrackPlayer.play();
      this.setState({bell: true});
      // BackgroundTimer.stop();
    }
    this.setState({isPlaying: !isPlaying});
    // BackgroundTimer.start();
  };

  /** The above code is defining a function called `closeAudio` in JavaScript. **/

  closeAudio = async () => {
    await TrackPlayer.updateOptions({stopWithApp: true});
    await TrackPlayer.reset();
    // num = await this.getCurrentTrackNum();
    // Platform.OS == 'android' && (await TrackPlayer.remove(num));
    // return false;
  };

  /** The above code is defining an arrow function called `animationComplete` that updates the state of a
component by setting the `animation` property to `true`. **/
  animationComplete = () => {
    this.setState({animation: true});
  };

  render() {
    /** The above code is using the TrackPlayer library in JavaScript to add an event listener for the
'playback-queue-ended' event. When this event is triggered, it will pause the playback of the
current track. **/
    TrackPlayer.addEventListener('playback-queue-ended', async () => {
      // Playback of the current track has ended
      await TrackPlayer.pause();
    });
    const {route, navigation} = this.props;
    const {isComplete, isPlaying, animation, badgeData} = this.state;
    const {meditation, background} = route?.params;
    const imageSource = isPlaying ? Images?.pauseButton : Images?.playButton;
    const initialState = {all_badges: [], last_unlocked: {}};
    const {last_unlocked} = badgeData || initialState;
    const {Content} = store.getState('Content');
    const {Auth} = store.getState('Auth');
    const {user} = Auth;
    const {homeContent} = Content;

    /**
     * The function `postDuration` posts the duration of a meditation session to an API and then retrieves
     * updated data on meditation minutes.
     **/
    const postDuration = async time => {
      const {data, ok, originalError} = await API.post('/play-minutes', {
        minutes: time ?? meditation,
        meditator: true,
      });

      getMinutesData();
      console.log('hdvbfhjsdbfjhsdbhjfbsd', data, originalError);
    };

    /**
     * The function `getMinutesData` makes an asynchronous API call to retrieve unlocked badge data and
     * updates the state with the received data.
     **/
    const getMinutesData = async () => {
      const {ok, data} = await API.get('/get-unlocked-badge');
      console.log('badge =========>>>>>', data);
      if (ok) {
        this.setState({
          homeContent: {
            total_spend_mints: data.total_spend_mints,
            total_taken_session: data.total_taken_session,
            streaks: data.streaks,
            badge: data.badge?.name ?? null,
          },
        });
      }
    };
    const newStyle = !this.state.medBedge
      ? {justifyContent: 'space-around'}
      : {};
    //AWAKE SCREEN
    //KEEP AWAKE FUNCTION

    return (
      <ViewShot
        ref={this.viewShotRef}
        // options={{
        //   handleGLSurfaceViewOnAndroid: true,
        //   snapshotContentContainer: true,
        // }}
        style={{flex: 1}}>
        <BlurBackground
          blurhash={background?.hash_code || ''}
          styles={styles.backgroundImage}
          uri={background?.background_image}>
          <SafeView>
            {/* {isComplete && (
              <LottieView
                ref={animation => {
                  this.animation = animation;
                }}
                loop={false}
                source={require('../../Assets/lottie/confetti.json')}
                onAnimationFinish={this.animationComplete}
                style={{
                  width: widthPercentageToDP('70'),
                  height: 200,
                  backgroundColor: 'red',
                }}
              />
            )} */}
            <SessionHeading
              {...{navigation, backButton: true, closeAudio: this.closeAudio}}
            />
            {!isComplete && (
              <View
                style={{...styles.container, justifyContent: 'space-around'}}>
                {/* <View>
                <Text style={styles.title}>Meditation</Text>
                <Text style={styles.timer}>{contentTime(meditation)}</Text>
              </View> */}

                <CountdownCircleTimer
                  size={320}
                  duration={meditation}
                  strokeWidth={16}
                  trailStrokeWidth={3}
                  strokeLinecap="round"
                  isPlaying={isPlaying}
                  trailColor={'transparent'}
                  // trailColor={Colors.blurWhite4}
                  // trailColor="rgba(69,197,175,0.25)"
                  colors={[Colors.blurWhite4, Colors.blurWhite4]}
                  // colors={['#287a8b', '#38a79f']}
                  // colors={[Colors.blurWhite4, '#38a79f']}
                  // colorsTime={[meditation]}
                  rotation="counterclockwise"
                  isSmoothColorTransition
                  onComplete={() => {
                    // BackgroundTask.define(() => {
                    //   this.ringTheEndBell();
                    //   BackgroundTask.finish();
                    // });
                    this.ringTheEndBell();
                    postDuration();
                    this.completeHandler();
                  }}>
                  {({remainingTime}) => (
                    <Text style={styles.count}>
                      {contentTime(remainingTime)}
                    </Text>
                  )}
                </CountdownCircleTimer>

                <View>
                  <Touchable
                    style={[
                      styles.playPauseButtonView,
                      {
                        paddingLeft: isPlaying
                          ? widthPercentageToDP('0')
                          : widthPercentageToDP('1'),
                      },
                    ]}
                    onPress={this.setSound}
                    Opacity={0.7}>
                    <Image
                      source={imageSource}
                      resizeMode="contain"
                      style={{
                        tintColor: Colors.white,
                        width: widthPercentageToDP('6'),
                      }}
                    />
                  </Touchable>
                  {/* <Text style={styles.timer}>{isPlaying ? 'Stop' : 'Start'}</Text> */}
                </View>
              </View>
            )}
            {isComplete && (
              <ScrollView
                contentContainerStyle={{
                  flex: 1,
                }}
                showsVerticalScrollIndicator={false}>
                <View
                  // ref={this.viewShotRef}
                  style={[styles.container, {height: 'auto', flex: 1}]}>
                  <Text
                    style={{
                      fontSize: hp('4'),
                      color: Colors.white,
                      // marginTop: hp('-2'),
                    }}>
                    Congratulations
                  </Text>
                  {this.state.animation == false && (
                    <LottieView
                      ref={animation => {
                        this.animation = animation;
                      }}
                      loop={false}
                      source={require('../../Assets/lottie/confetti.json')}
                      onAnimationFinish={this.animationComplete}
                      style={{
                        width: widthPercentageToDP('80'),
                        height: heightPercentageToDP('50'),
                        // backgroundColor: 'red',
                      }}
                    />
                  )}
                  <View
                    style={[
                      styles.container,
                      {
                        width: '100%',
                        opacity: animation ? 1 : 0,
                        ...newStyle,
                      },
                    ]}>
                    {this.state.medBedge && this.state.animation && (
                      <LottieView
                        source={LottieBadges['MeditationTimer']}
                        autoPlay
                        style={{
                          height: heightPercentageToDP('20'),
                          width: widthPercentageToDP('70'),
                          // backgroundColor: 'red',
                          // marginTop: heightPercentageToDP('1'),
                          marginTop: hp('1'),
                          // marginBottom: hp('2'),
                        }}
                      />
                    )}
                    {/* <Lottie
                    source={LottieBadges[last_unlocked?.name]}
                    autoPlay
                    style={{height: 200}}
                  /> */}
                    {/* <Image
                  source={Images.meditate}
                  style={{width: 250, height: 250}}
                /> */}
                    <View>
                      <Text
                        style={[
                          styles.timer,
                          {
                            fontSize: heightPercentageToDP('2'),
                            fontWeight: '400',
                            // marginTop: hp('1'),
                            // marginBottom: hp('1'),
                          },
                        ]}>
                        You have completed your {contentTime(meditation, true)}{' '}
                        of meditation
                      </Text>
                    </View>
                    <View style={styles.steaksView}>
                      <StreakSection
                        // style={{padding: 5}}
                        {...this.state.homeContent}
                      />
                      <ShareButton
                        style={{
                          width:
                            Platform.OS == 'ios'
                              ? widthPercentageToDP('85')
                              : '92%',
                          // width: Platform.OS == 'ios' ? '94%' : '92%',
                          // width: this.state.medBedge ? '90%' : '95%',
                          alignSelf: 'center',
                        }}
                        title="Share My Stats"
                        onPress={() =>
                          this.viewShotRef != null &&
                          shareStats(this.viewShotRef)
                        }
                      />
                    </View>
                    {!user?.is_subscribed && (
                      <ShareButton
                        title="Unlock Believe Premium"
                        textStyle={{fontSize: hp('2')}}
                        onPress={() => navigation.navigate('Subscription')}
                        style={{marginBottom: hp('3')}}
                        hide={true}
                      />
                    )}
                    <ShareButton
                      title="Finish"
                      onPress={() => navigation.goBack()}
                      hide={true}
                    />
                  </View>
                </View>
              </ScrollView>
            )}
          </SafeView>
        </BlurBackground>
      </ViewShot>
    );
  }
}
// const mapDispatchToProps = dispatch => {
//   return {
//     appMusic: appMusic => {
//       console.log(appMusic, 'appMusic');
//       dispatch(playMusic({appMusic}));
//     },
//   };
// };
export default SessionTimer;
// export default connect(null, mapDispatchToProps)(SessionTimer);
