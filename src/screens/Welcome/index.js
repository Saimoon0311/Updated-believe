import React from 'react';
import {View, Text, ScrollView, Linking} from 'react-native';
import FastImage from 'react-native-fast-image';
import {logo} from '../../Assets/Images';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import SocialIcons from '../../components/SocialIcons';
import InAppBrowser from '../../services/InAppBrowser';
import AnimatedBackground from '../../components/AnimatedBackground';
import {normal} from '../../Assets/lottie';

const privacy = 'https://believehypnosis.app/privacy';
const terms = 'https://believehypnosis.app/terms';

const Welcome = ({navigation, route}) => {
  const onLogin = () => navigation.navigate('Login');
  return (
    <AnimatedBackground animation={normal}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <FastImage source={logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.logoDesc} numberOfLines={3}>
            Create Your Free Account Now to Access Your Personalized
            Recommendation
          </Text>
          <Text style={styles.plusText}>Plus:</Text>
        </View>
        <View style={styles.textContainer}>
          <View style={styles.rowCenter}>
            <Icon name="checkmark" size={30} color="#fff" />
            <Text style={styles.description}>Create Playlists</Text>
          </View>
          <View style={styles.rowCenter}>
            <Icon name="checkmark" size={30} color="#fff" />
            <Text style={styles.description}>Store Favorites</Text>
          </View>
          <View style={styles.rowCenter}>
            <Icon name="checkmark" size={30} color="#fff" />
            <Text style={styles.description}>
              Listen to Dozens of Free Tracks
            </Text>
          </View>
          <Text
            style={[styles.description, {textAlign: 'left', marginLeft: 30}]}>
            ... and so much more!
          </Text>
        </View>
        <SocialIcons height={180} {...{navigation, route}} />
        <View style={styles.footerContainer}>
          <Text style={styles.alreadyText}>
            Already have an account?{' '}
            <Text onPress={onLogin} style={styles.underLine}>
              Sign in
            </Text>
          </Text>
          <Text style={styles.terms}>
            By continuing, you agree to Believe’s{' '}
            <Text
              onPress={() => InAppBrowser.open(terms)}
              // onPress={() => Linking.openURL(terms)}
              style={styles.underLine}>
              Terms & Conditions
            </Text>{' '}
            and{' '}
            <Text
              // onPress={() => Linking.openURL(privacy)}
              onPress={() => InAppBrowser.open(privacy)}
              style={styles.underLine}>
              Privacy Policy
            </Text>
          </Text>
        </View>
      </ScrollView>
    </AnimatedBackground>
  );
};

export default Welcome;
