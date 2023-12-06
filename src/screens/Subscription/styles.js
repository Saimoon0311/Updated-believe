import {Colors, FontFamily, Sizes} from '../../theme/Variables';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginHorizontal: '5%',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    resizeMode: 'contain',
    backgroundColor: Colors.primaryColor,
  },
  mainContainer: {
    paddingHorizontal: '5%',
  },
  heading: {
    fontSize: 22,
    textAlign: 'center',
    color: Colors.white,
    paddingVertical: 20,
    fontFamily: FontFamily.regular,
  },
  heading: {
    fontSize: 24,
    lineHeight: 35,
    textAlign: 'center',
    color: Colors.white,
    fontFamily: FontFamily.medium,
  },
  badgeBox: {
    marginVertical: 30,
    alignItems: 'flex-start',
  },
  subContainer: {
    paddingTop: 0,
    height: '67.5%',
    width: '100%',
    paddingHorizontal: 20,
  },
  durationText: {
    fontSize: 22,
    marginTop: 2.5,
    textAlign: 'center',
    color: Colors.white,
    fontFamily: FontFamily.light,
    fontWeight: '400',
  },
  planBox: {
    marginTop: 50,
    marginVertical: 20,
  },
  bottom: {
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  planHeading: {
    fontSize: 22,
    color: Colors.white,
    textAlign: 'center',
    fontFamily: FontFamily.medium,
    marginVertical: 20,
  },
  cancelHeading: {
    fontSize: 16,
    marginBottom: 30,
    color: Colors.white,
    textAlign: 'center',
    fontFamily: FontFamily.light,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  button: {
    width: '80%',
    borderRadius: 18,
    marginBottom: 40,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#45C5AF',
    marginTop: 25,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  boxData: {
    height: Sizes.width / 2 - 40,
    width: Sizes.width / 2 - 40,
    margin: 10,
    borderRadius: 10,
  },
  card: {
    borderWidth: 2,
    borderRadius: 10,
    width: '45%',
    height: 170,
    padding: '4%',
    // width: Sizes.width * 0.42,
    borderColor: Colors.borderBlue,
    backgroundColor: Colors.barFaded,
    marginRight: Sizes.width * 0.075,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subHeading: {
    fontSize: 14,
    // marginTop: 5,
    color: Colors.white,
    fontFamily: FontFamily.regular,
  },
  miniButton: {
    marginVertical: 15,
    width: 100,
    borderRadius: 10,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#45C5AF',
  },
});