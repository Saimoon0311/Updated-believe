import {useState} from 'react';
import API from '../../services/API';

/**
 * The `useReminderDetail` function is a custom hook that manages the state of a reminder's activation
 * status and provides a function to toggle the notification.
 * @returns The `useReminderDetail` function is returning an object with three properties: `data`,
 * `toggleNotification`, and `isActive`.
 **/
const useReminderDetail = param => {
  const {params} = param;
  /** The line `const [isActive, setIsActive] = useState(params?.status == 1 ? true : false);` is using
  the `useState` hook from React to create a state variable called `isActive` and a corresponding
  setter function called `setIsActive`. **/
  const [isActive, setIsActive] = useState(params?.status == 1 ? true : false);
  /**
   * The function `toggleNotification` adds a notification.
   **/
  const toggleNotification = async () => {
    addNotification();
  };

  /**
   * The function `addNotification` updates the status of a reminder and toggles the value of
   * `isActive` if the update is successful.
   **/
  const addNotification = async () => {
    const notification = {
      reminder_id: params?.id,
    };
    const {ok, data} = await API.put(`/reminder-status`, notification);
    if (ok) setIsActive(pre => !pre);
  };
  return {data: params, toggleNotification, isActive};
};

export default useReminderDetail;
