import {Colors, FontFamily, FontSize, Sizes} from '../../theme/Variables';
import {StyleSheet} from 'react-native';
import {heightPercentageToDP} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    marginTop: heightPercentageToDP('9'),
    height: heightPercentageToDP('60'),
    alignItems: 'center',
    marginHorizontal: '5%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    resizeMode: 'contain',
    backgroundColor: Colors.primaryColor,
  },
  title: {
    fontSize: heightPercentageToDP('4'),
    textAlign: 'center',
    color: Colors.white,
    fontFamily: FontFamily.medium,
  },
  pickerContainer: {
    paddingBottom: heightPercentageToDP('6'),
    alignItems: 'center',
    flexDirection: 'row',
    width: Sizes.width * 0.65,
    justifyContent: 'space-between',
  },
});
