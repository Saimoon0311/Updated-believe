import {Colors, FontFamily} from '../../theme/Variables';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '5%',
    marginHorizontal: '5%',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    resizeMode: 'contain',
    backgroundColor: Colors.primaryColor,
  },
  bottom: {
    marginTop: '10%',
    marginHorizontal: '5%',
  },
  text: {
    textAlign: 'center',
    color: Colors.white,
    marginVertical: 10,
    fontSize: 14,
    marginBottom: 30,
  },
});
