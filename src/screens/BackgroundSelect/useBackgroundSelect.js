import {useEffect, useState} from 'react';
import {BackHandler} from 'react-native';
import useReduxStore from '../../hooks/useReduxStore';
import {getAllBackgrounds} from '../../store/actions/content-action';

/**
 * The `useBackgroundSelect` function is a custom hook in JavaScript that handles background selection
 * and navigation.
 * @param navigation - The `navigation` parameter is an object that contains methods and properties
 * related to navigation in React Navigation. It is typically used to navigate between screens in a
 * React Native application.
 * @returns The function `useBackgroundSelect` returns an object with the following properties:
 **/
const useBackgroundSelect = (navigation, {params}) => {
  const {getState, dispatch} = useReduxStore();
  const [active, setActive] = useState(true);
  const {backgrounds} = getState('Content');
  const [marked, setMarked] = useState(params?.background);

  /**
   * The backFunction is used to navigate to the 'Settings' screen with a background parameter based on
   * the value of the marked title.
   * @returns `true`.
   **/
  const backFunction = () => {
    navigation.navigate('Settings', {
      ...params,
      background: marked?.title == 'Default' ? '' : marked,
    });
    return true;
  };

  /**
   * The code defines two functions, `onRefresh` and `toggle`, in JavaScript.
   **/
  const onRefresh = () => dispatch(getAllBackgrounds());
  const toggle = () => setActive(prev => !prev);

  const setMarkedHandler = param => active && setMarked(param);

  /**The `useEffect` hook is used to perform side effects in a functional component. In this code
snippet, the `useEffect` hook is used to add event listeners for the 'gestureEnd' event and the
'hardwareBackPress' event. **/
  useEffect(() => {
    const gestureEnd = navigation.addListener('gestureEnd', e =>
      backFunction(),
    );

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backFunction,
    );

    if (!backgrounds.length) onRefresh();

    return () => {
      backHandler.remove();
      gestureEnd();
    };
  }, [marked]);

  return {
    data: params,
    backgrounds: [
      ...backgrounds,
      {
        id: 9999,
        name: 'Background',
        hash_code: '',
        background_image: '',
        title: 'Default',
      },
    ],
    marked,
    setMarked: setMarkedHandler,
    backFunction,
    onRefresh,
    active,
    toggle,
  };
};

export default useBackgroundSelect;
