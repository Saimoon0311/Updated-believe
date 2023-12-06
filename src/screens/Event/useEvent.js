import {useEffect, useState} from 'react';
import {getAllEvents} from '../../store/actions/content-action';
import useReduxStore from '../../hooks/useReduxStore';
/**
 * The `useEvent` function is a custom hook that retrieves data from the Redux store and provides
 * options, data, and functions related to events.
 * @returns The function `useEvent` returns an object with the following properties:
 **/
const useEvent = ({navigation}) => {
  const {getState, dispatch} = useReduxStore();
  const {liveEvents} = getState('Content');

  const options = [
    {label: 'Attended', value: '1'},
    {label: 'Upcoming', value: '2'},
  ];
  /** The line `const [card, setCard] = useState({value: '2'});` is using the `useState` hook to create
  a state variable called `card` and a corresponding setter function called `setCard`. The initial
  value of `card` is set to an object with a property `value` set to `'2'`. This state variable can
  be used to keep track of the selected option from the `options` array. **/
  const [card, setCard] = useState({value: '2'});

  // console.log('liveEvents', liveEvents);

  /** The line `const {attended_events, upcoming_events} = liveEvents;` is destructuring the
  `liveEvents` object and assigning the values of its properties `attended_events` and
  `upcoming_events` to the variables `attended_events` and `upcoming_events` respectively. This
  allows easier access to these properties within the code. **/
  const {attended_events, upcoming_events} = liveEvents;

  /**
   * The function "onRefresh" dispatches an action to get all events.
   **/
  const onRefresh = () => dispatch(getAllEvents());

  console.log('upcoming_events', upcoming_events);

  //   const likeEventFun = (id)=>{
  // const {ok,data} = API.post("",{
  //   event_id:id
  // })
  // if (ok) onRefresh()
  // }

  useEffect(() => {
    onRefresh();
  }, []);

  const data = card.value == '1' ? attended_events : upcoming_events;

  return {options, data, card, setCard, onRefresh, likeEventFun: () => {}};
};

export default useEvent;
