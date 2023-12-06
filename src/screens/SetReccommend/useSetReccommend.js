import {useState} from 'react';
import moment from 'moment';
import * as OnBoardService from '../../services/onboard-service';

/**
 * The `useSetReccommend` function is a custom hook in JavaScript that handles the selection of time
 * and moment for user onboarding and navigation to the 'Finalize' screen.
 * @returns The function `useSetReccommend` returns an object with the following properties:
 **/
const useSetReccommend = ({navigation, route}) => {
  const data = route.params;
  const [time, setTime] = useState('Set Time');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const stringType = Boolean(typeof time == 'string');
  const selectedTime = stringType ? time : moment(time).format('hh:mm A');

  /**
   * The function `showDatePicker` sets the visibility of a date picker to true.
   **/
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  /**
   * The function `hideDatePicker` sets the visibility of a date picker to false.
   **/
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  /**
   * The handleConfirm function hides the date picker, sets the selected date and time, and formats the
   * hours and minutes.
   **/
  const handleConfirm = date => {
    hideDatePicker();
    setTime(date);
    setHours(moment(date).format('hh'));
    setMinutes(moment(date).format('mm'));
  };

  /** The `selectMoment` constant is an array of objects that represents different moments of the day.
  Each object has two properties: `id` and `title`. The `id` property represents the unique
  identifier for each moment, and the `title` property represents the name or title of the moment
  (e.g., "Before Bed", "Morning", "Evening", "Free Time"). This array is used to populate a dropdown
  menu or select options for the user to choose their preferred moment. **/
  const selectMoment = [
    {
      id: 1,
      title: 'Before Bed',
    },
    {
      id: 2,
      title: 'Morning',
    },
    {
      id: 3,
      title: 'Evening',
    },
    {
      id: 4,
      title: 'Free Time',
    },
  ];

  /** The line `const [momentView, setMomentView] = useState({ id: selectMoment[0].id, title:
  selectMoment[0].title });` is initializing a state variable called `momentView` using the
  `useState` hook. **/
  const [momentView, setMomentView] = useState({
    id: selectMoment[0].id,
    title: selectMoment[0].title,
  });

  const [visible, setVisible] = useState(false);
  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);

  /**
   * The onSelect function sets the moment view with the provided data and hides the menu.
   **/
  const onSelect = data => {
    setMomentView(data);
    hideMenu();
  };

  /**
   * The GoNext function will call the onSubmit function if the stringType variable is not true.
   **/
  const GoNext = () => !stringType && onSubmit();

  /**
   * The `onSubmit` function is an asynchronous function that handles the finalization of user
   * onboarding by making a request to the `OnboardFinalizeService` endpoint and navigating to the
   * 'Finalize' screen if the request is successful.
   **/
  const onSubmit = async () => {
    try {
      const {ok, data: responseData} =
        await OnBoardService.OnboardFinalizeService({
          user_name: data?.username,
          tracks_length: data?.track?.name,
          gender: data?.gender?.name,
          age: data?.age?.name,
          recommendation_time: time,
          moment: momentView?.title,
          usergoal_ids: data?.goals,
          userfeeling_ids: data?.feeling,
        });
      if (ok) navigation.navigate('Finalize', responseData);
    } catch (error) {
      console.log(error);
    }
  };

  // const GoNext = () =>
  //   !stringType && navigation.navigate('Finalize', {...data, time, momentView});

  return {
    visible,
    selectedTime,
    momentView,
    selectMoment,
    isDatePickerVisible,
    hideMenu,
    showMenu,
    onSelect,
    setMomentView,
    showDatePicker,
    hideDatePicker,
    handleConfirm,
    GoNext,
  };
};

export default useSetReccommend;
