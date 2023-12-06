import moment from 'moment';

/**
 * The `useFinalize` function takes in the `navigation` and `route` objects, extracts data from the
 * `route.params` object, formats the data using the `moment` library, and returns the extracted data
 * and functions to navigate to the next screen.
 * @returns The function `useFinalize` is returning an object with the following properties:
 **/
const useFinalize = ({navigation, route}) => {
  /** `const data = route.params;` is assigning the value of `route.params` to the variable `data`.
  `route.params` is an object that contains any parameters passed to the current route. By assigning
  it to `data`, the code can access and use the parameters passed to the route. **/
  const data = route.params;

  /**
   * The GoNext function replaces the current screen with the MainTabScreen.
   **/
  const GoNext = () => navigation.replace('MainTabScreen');

  /** The line `const meditateMoment = data?.momentView?.title;` is accessing the `title` property of
  the `momentView` object within the `data` object. **/
  const meditateMoment = data?.momentView?.title;
  /** The line `const meditateTime = moment(data?.time).format('hh:mm A');` is using the `moment`
  library to format the `time` property of the `data` object. **/
  const meditateTime = moment(data?.time).format('hh:mm A');

  return {data, meditateMoment, meditateTime, GoNext};
};

export default useFinalize;
