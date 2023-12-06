import React, {useState} from 'react';
import {View} from 'react-native';
import {normal} from '../../Assets/lottie';
import {styles} from './styles';
import LottieView from 'lottie-react-native';
import AnimatedBackground from '../../components/AnimatedBackground';
import AnimatedTyping from '../../components/AnimatedTyping';
import {useEffect} from 'react';
import {OnboardFinalizeService} from '../../services/onboard-service';

/**
 * The `ContentLoading` function is a React component that displays a loading animation and text while
 * creating personal recommendations.
 * @returns The component is returning a JSX element. It is rendering an `<AnimatedBackground>`
 * component with an animation prop, a `<View>` component with a style prop, and an `<AnimatedTyping>`
 * component with various props. Inside the `<View>` component, there is another `<View>` component
 * that renders a Lottie animation using the `<LottieView>` component.
 **/
const ContentLoading = ({navigation, route}) => {
  const {params} = route;
  const [dummy, setDummy] = useState(1);
  /** The `useEffect` hook is used to perform side effects in functional components. In this case, it is
used to add an event listener to the navigation object when the component is focused. **/
  useEffect(() => {
    const event = navigation.addListener('focus', () => {
      setDummy(dummy + 1);
    });
    return event;
  }, [dummy]);

  return (
    <AnimatedBackground animation={normal}>
      <View style={styles.subcontainer}>
        <AnimatedTyping
          text={[`Creating Your Personal Recommendations .   .   .`]}
          style={[styles.heading, {height: 300}]}
          onComplete={() => navigation.navigate('Welcome', {...params})}
          speed={50}
        />

        <View style={{height: 300, width: 300, position: 'absolute'}}>
          <LottieView
            source={require('../../Assets/lottie/loading.json')}
            autoPlay
            loop
          />
        </View>
      </View>
    </AnimatedBackground>
  );
};

export default ContentLoading;
