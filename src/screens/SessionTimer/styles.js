import {Colors, FontFamily, FontSize, Sizes} from '../../theme/Variables';
import {Dimensions, StyleSheet} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    height: '80%',
    marginHorizontal: '5%',
    // justifyContent: 'space-around',
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
    backgroundColor: Colors.blackDark,
    // height: '25%',
    justifyContent: 'center',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: hp('2'),
    marginTop: hp('1.5'),
    paddingBottom: hp('2'),
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
});
