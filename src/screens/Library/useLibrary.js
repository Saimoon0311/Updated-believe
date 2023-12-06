import {useEffect, useRef, useReducer, useState} from 'react';
import API from '../../services/API';
import {initialState, reducer} from './reducer';
import useReduxStore from '../../hooks/useReduxStore';
import {contentDataList} from '../../utils/helper/LocalDb';

/**
 * The `useLibrary` function is a custom hook in JavaScript that provides various functionalities for a
 * library component, including filtering, navigation, and data management.
 * @returns The function `useLibrary` returns an object with the following properties and values:
 **/
const useLibrary = ({navigate}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const modalizeRef = useRef(null);
  const listRef = useRef(null);
  const {marked} = state;
  const {getState} = useReduxStore();
  /** The `dataRef` constant is creating a mutable ref object using the `useRef` hook. This ref object
  is initialized with an initial value that contains various properties such as `marked`,
  `Hypnosis`, `Meditation`, `Affirmations`, `Courses`, `Series`, `Scripts`, `Videos`, `EBooks`,
  `categories`, `request_url`, and `selectedCategory`. These properties are used to store and access
  data related to the library functionality. The initial values of these properties are empty
  arrays, empty strings, or default values. The `dataRef` ref object can be accessed and modified
  throughout the component's lifecycle, and the values stored in it will persist across re-renders. **/
  const dataRef = useRef({
    marked: contentDataList[0],
    Hypnosis: [],
    Meditation: [],
    Affirmations: [],
    Courses: [],
    Series: [],
    Scripts: [],
    Videos: [],
    EBooks: [],
    categories: [],
    request_url: '',
    selectedCategory: '',
  });
  /** The line `const categoryFilterDataRed = useRef(null);` is creating a mutable ref object called
  `categoryFilterDataRed` and initializing it with a value of `null`. This ref object can be used to
  store a value that persists across re-renders of the component. It is commonly used to store
  mutable values that need to be accessed by other functions or hooks within the component. **/
  const categoryFilterDataRed = useRef(null);
  /** The line `const [filterData, setFilterData] = useState({id: 7});` is using the `useState` hook to
  create a state variable called `filterData` and a corresponding setter function called
  `setFilterData`. The initial value of `filterData` is an object with a single property `id` set to
  7. **/
  const [filterData, setFilterData] = useState({id: 7});

  /**
   * The function `requestParam` takes in a parameter object and adds a property `requestParam` with the
   * value of `state?.request_url`.
   **/
  const requestParam = params => ({
    ...params,
    requestParam: state?.request_url,
  });

  /** The line `const {user} = getState('Auth');` is using the `getState` function from the
  `useReduxStore` hook to retrieve the `user` object from the `Auth` state. It is destructuring the
  `user` object from the returned value of `getState('Auth')`. This allows the component to access
  the `user` object and check if the user is subscribed or not. **/
  const {user} = getState('Auth');
  const isSubscript = Boolean(user?.is_subscribed);
  const onOpen = () => modalizeRef.current?.open();

  /**
   * The function `onFilterSelect` filters an array based on a minimum and maximum value, returning only
   * the elements that meet the criteria.
   * @param min - The `min` parameter is the minimum value for the filter. It is used to filter out items
   * with a duration less than this minimum value.
   * @param max - The `max` parameter is used to specify the maximum value for filtering. It is an
   * optional parameter, meaning it can be undefined.
   * @returns The function `onFilterSelect` returns a filtered array based on the minimum and maximum
   * values provided.
   **/
  const onFilterSelect = (min, max) => {
    const getMax = Boolean(max != undefined);
    return state[marked?.name].filter(i => {
      const timeCat = Number(Math.floor(i?.duration));
      return getMax ? timeCat >= min && timeCat <= max : timeCat >= min;
    });
  };

  /**
   * The function `onClose` sets filter data based on the provided filter object and then performs
   * additional logic based on the type of the `min` and `max` properties before closing a modal.
   **/
  const onClose = filter => {
    setFilterData({id: filter?.id});
    const min = filter?.min;
    const max = filter?.max;
    const time = filter?.time;
    const stringTimeMax = Boolean(typeof max == 'string');
    const stringTimeAll = Boolean(typeof min && max == 'string');
    if (stringTimeAll) categoryFilterDataRed.current = state;
    else if (stringTimeMax) categoryFilterDataRed.current = onFilterSelect(min);
    else categoryFilterDataRed.current = onFilterSelect(min, max);
    modalizeRef.current?.close();
  };
  /**
   * The onPressSearchBar function navigates to the 'Search' page.
   **/
  const onPressSearchBar = () => navigate('Search');
  /**
   * The function "courseDetail" is used to navigate to the "CourseDetail" page with the given
   * parameters.
   **/
  const courseDetail = params => navigate('CourseDetail', params);
  /**
   * The function `libraryDetail` takes in a parameter and uses it to navigate to a specific page URL
   * and make a request with the parameter.
   **/
  const libraryDetail = params =>
    navigate(marked?.page_url, requestParam(params));

  /**
   * The function "seriesDetail" navigates to the "SeriesDetails" page with the given parameters.
   **/
  const seriesDetail = params =>
    navigate('SeriesDetails', requestParam(params));

  /**
   * The function eBookDetail takes in parameters and navigates to the 'DownloadContent' page with the
   * request parameters.
   **/
  const eBookDetail = params =>
    navigate('DownloadContent', requestParam(params));

  /**
   * The `onRefresh` function is an asynchronous function that updates the state and dispatches an
   * action based on the provided parameters.
   * @param param - The `param` parameter is a string that represents the content type. It is used to
   * construct the API endpoint URL.
   * @param [id] - The `id` parameter is an optional parameter that represents the ID of a category. It
   * is used in the API request to filter the content based on the category ID. If no `id` is provided,
   * it will fallback to `state?.selectedCategory?.id` or an empty string.
   **/
  const onRefresh = async (param, id = '') => {
    setFilterData({id: 7});
    console.log('paramparamparamparam', param);
    const route = param || marked?.name;
    const {data} = await API.get(
      `/all-content?content_type=${route.toLowerCase()}&course_cat_id=${
        id || state?.selectedCategory?.id || ''
      }`,
    );
    dataRef.current = {
      ...dataRef.current,
      [route]: data[route.toLowerCase()],
      request_url: data?.request_url,
      categories: data?.categories || state?.categories || [],
      ...(Boolean(state?.selectedCategory == '' && route == 'Courses') && {
        selectedCategory: data?.categories[0],
      }),
    };
    dispatch({
      type: 'update_Reducer',
      payload: {
        [route]: data[route.toLowerCase()],
        request_url: data?.request_url,
        categories: data?.categories || state?.categories || [],
        ...(Boolean(state?.selectedCategory == '' && route == 'Courses') && {
          selectedCategory: data?.categories[0],
        }),
      },
    });
  };

  /**
   * The function updates the marked object, refreshes the page with the new object's name, scrolls to
   * the top of a list, and updates the state and reducer with the new marked object.
   * @returns The function `updateAndRoute` does not have a return statement. Therefore, it does not
   * return any value.
   **/
  const updateAndRoute = obj => {
    if (obj?.id == marked.id) return;
    else onRefresh(obj?.name || marked?.name);
    listRef.current?.scrollToOffset({animated: true, offset: 0});
    categoryFilterDataRed.current = null;
    dataRef.current = {
      ...dataRef.current,
      marked: obj,
    };
    dispatch({
      type: 'update_Reducer',
      payload: {marked: obj},
    });
  };

  /**
   * The function updates the course category and triggers a refresh.
   * @returns nothing (undefined) if the condition `selectedCategory?.id ==
   * state?.selectedCategory?.id` is true.
   **/
  const updateCourseCategory = selectedCategory => {
    if (selectedCategory?.id == state?.selectedCategory?.id) return;
    dispatch({type: 'update_Reducer', payload: {selectedCategory}});
    dataRef.current = {
      ...dataRef.current,
      selectedCategory,
    };
    onRefresh(marked?.name, selectedCategory?.id);
  };

  /** The code `() => { onRefresh(marked?.name); }` is an arrow function that is being passed as a
  callback to the `useEffect` hook. **/
  useEffect(() => {
    onRefresh(marked?.name);
  }, []);

  return {
    state: dataRef.current,
    listRef,
    modalizeRef,
    isSubscript,
    onOpen,
    onPress: onPressSearchBar,
    onClose,
    onRefresh,
    eBookDetail,
    courseDetail,
    seriesDetail,
    libraryDetail,
    updateAndRoute,
    updateCourseCategory,
    categoryFilterData: categoryFilterDataRed.current,
    filterData,
  };
};

export default useLibrary;
