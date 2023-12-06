import {useEffect, useRef, useState} from 'react';
import useReduxStore from '../../hooks/useReduxStore';
import {getAllReviews, postReview} from '../../store/actions/content-action';
import Schemas from '../../utils/Validation';
import useFormHook from '../../hooks/useForm';

/**
 * The `useReviews` function is a custom hook that handles the logic for posting and retrieving
 * reviews, as well as managing the state and form validation.
 * @param navigation - The `navigation` parameter is an object that contains information about the
 * navigation state of the application. It is typically used to navigate between screens or access
 * navigation-related functions and properties.
 * @returns The function `useReviews` returns an object with the following properties:
 **/
const useReviews = (navigation, {params}) => {
  const data = params;
  const {getState, dispatch} = useReduxStore();
  const {allReviews} = getState('Content');
  const [rating, setRating] = useState(0);
  const {handleSubmit, reset, errors, control} = useFormHook(
    Schemas.reviewSend,
  );
  const modalizeRef = useRef(null);
  const onOpen = () => modalizeRef.current?.open();
  const onClose = () => modalizeRef.current?.close();

  /**
   * The function `onSubmit` posts a review with a rating and additional parameters, resets the form,
   * refreshes the page, and closes a modal.
   **/
  const onSubmit = message => {
    if (rating != 0) {
      dispatch(
        postReview({
          params: {
            ...message,
            rating,
            [data?.value]: data?.id,
          },
          sendParam: data?.sendRequest,
        }),
      );
      reset('', {
        keepValues: false,
      });
      onRefresh();
      onClose();
    }
  };

  // console.log('useReviews', data);
  // console.log('allReviews', allReviews);

  /**
   * The function "onRefresh" dispatches a "getAllReviews" action with the "requestParam" data.
   **/
  const onRefresh = _ => dispatch(getAllReviews(data?.requestParam));

  useEffect(() => {
    onRefresh();
  }, []);

  return {
    data,
    rating,
    allReviews,
    modalizeRef,
    errors,
    control,
    handleSubmit,
    onSubmit,
    onOpen,
    onClose,
    setRating,
    onRefresh,
  };
};

export default useReviews;
