import {useEffect, useState} from 'react';
import ContentService from '../../services/content-service';

/**
 * The `useScriptDetails` function is a custom hook that manages the state and functionality related to
 * a script's details, including menu visibility, script chapters, navigation to content and reviews,
 * and refreshing the script's videos.
 * @param navigation - The `navigation` parameter is an object that contains methods and properties
 * related to navigation in a React Native application. It is typically provided by the React
 * Navigation library and allows you to navigate between screens, pass parameters, and perform other
 * navigation-related tasks.
 * @returns The hook is returning an object with the following properties:
 **/
const useScriptDetails = (navigation, {params}) => {
  /** A hook that is used to set the state of the menu. **/
  const [visible, setVisible] = useState(false);
  const [scriptChapters, setScriptChapters] = useState([]);
  /** A custom hook that returns the state and dispatch of the redux store. **/
  /**
   * It navigates to the ReadContent screen and passes the params object as an argument
   **/
  const contentDetail = params => navigation.navigate('ReadContent', params);
  /**
   * It sets the value of the visible state to false
   **/
  const hideMenu = () => setVisible(false);
  /**
   * `showMenu` is a function that sets the value of `visible` to `true`
   **/
  const showMenu = () => setVisible(true);

  /**
   * `viewReviews` is a function that navigates to the Reviews screen and passes the `data` object, the
   * `requestParam` string, the `value` string, and the `sendRequest` string as props
   **/
  const viewReviews = () => {
    hideMenu();
    navigation.navigate('Reviews', {
      ...params,
      requestParam: `script-reviews?script_id=${params?.id}`,
      value: 'script_id',
      sendRequest: 'add-script-review',
    });
  };

  /**
   * It fetches all the videos of a particular category
   **/
  const onRefresh = async () => {
    try {
      const {ok, data} = await ContentService.allCategoryVideos({
        id: params?.id,
        requestParam: params?.requestParam,
      });
      if (ok) setScriptChapters(data?.chapters || []);
    } catch (error) {
      console.log(error, 'onRefresh');
    }
  };

  /** Calling the `onRefresh` function when the component mounts. **/
  useEffect(() => {
    onRefresh();
  }, []);

  /** Returning the values of the variables that are used in the hook. **/
  return {
    data: params,
    scriptChapters,
    visible,
    hideMenu,
    showMenu,
    viewReviews,
    contentDetail,
    onRefresh,
    viewReviews,
  };
};

export default useScriptDetails;
