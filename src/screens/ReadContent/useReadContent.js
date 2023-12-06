import {useState} from 'react';

/**
 * The `useReadContent` function is a custom hook in JavaScript that manages the state of a count
 * variable and provides functions to increment, decrement, and update the count value based on a slide
 * parameter.
 * @returns The function `useReadContent` returns an object with the following properties:
 **/
const useReadContent = ({navigation, route}) => {
  const data = route.params;
  const [count, setCount] = useState(1);

  /**
   * The function `increment` increases the value of `count` by 1 if it is less than 5.
   **/
  const increment = () => {
    // setCount(slide + 1);
    if (count < 5) setCount(prev => prev + 1);
  };

  /**
   * The function `decrement` decreases the value of `count` by 1 if it is greater than 1.
   **/
  const decrement = () => {
    // setCount(slide - 1);
    if (count > 1) setCount(prev => prev - 1);
  };

  /**
   * The function "onSlide" updates the count variable with the floor value of the slide parameter.
   **/
  const onSlide = slide => {
    setCount(Math.floor(slide));
    // setCount(slide);
  };

  // console.log('ReadContent', data);

  return {data, count, increment, decrement, onSlide};
};

export default useReadContent;
