import {StyleSheet, Platform} from 'react-native';
import {Colors, FontFamily, Sizes} from '../../theme/Variables';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    resizeMode: 'contain',
    backgroundColor: Colors.primaryColor,
  },
  container: {
    flex: 0.95,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    width: '95%',
  },
  title: {
    fontSize: heightPercentageToDP('6'),
    color: Colors.white,
    textAlign: 'center',
    fontFamily: FontFamily.light,
  },
  description: {
    fontSize: 20,
    marginTop: 12,
    lineHeight: 30,
    textAlign: 'center',
    color: Colors.white,
    fontFamily: FontFamily.light,
  },
  leftButton: {
    left: 0,
    top: '3.5%',
    position: 'absolute',
  },
  rightButton: {
    right: 20,
    top: '3.5%',
    position: 'absolute',
  },
  rowMid: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginHorizontal: 15,
    height: heightPercentageToDP('50'),
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 20,
  },
  boxData: {
    height: Sizes.width / 2.7,
    width: Sizes.width / 2.3,
    marginBottom: heightPercentageToDP('1'),
    borderRadius: 10,
  },
  boxImage: {
    height:
      Platform.OS == 'ios'
        ? heightPercentageToDP('17')
        : heightPercentageToDP('18.25'),
    // height: heightPercentageToDP('18.25'),
    // width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  bottomView: {
    width: '100%',
  },
  button: {
    width: '100%',
  },
  heading: {
    fontSize: heightPercentageToDP('1.6'),
    textAlign: 'left',
    color: Colors.white,
    fontFamily: FontFamily.medium,
    width: widthPercentageToDP('43'),
  },
  textContainer: {
    bottom: 0,
    // zIndex: 1,
    height: '33%',
    // width: widthPercentageToDP('43.4'),
    paddingVertical: 5,
    position: 'absolute',
    paddingHorizontal: 8.5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: Colors.gray2,
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    color: Colors.white,
    fontSize: 14,
  },
  dotsItem: (currentIndex, index) => ({
    height: 15,
    width: 15,
    borderRadius: 15 / 2,
    marginHorizontal: 10,
    backgroundColor:
      currentIndex == index ? Colors.greenFaded : Colors.primaryColor3,
  }),
});
