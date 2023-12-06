import {useEffect, useRef, useState} from 'react';
import {showError} from '../../services/SnackBar';
import API from '../../services/API';

/**
 * The `useReminders` function is a custom hook in JavaScript that provides various state variables and
 * functions for managing reminders, including adding, editing, deleting, and refreshing reminders.
 * @param navigation - The `navigation` parameter is an object that contains methods and properties
 * related to navigation in a React Native application. It is typically provided by the React
 * Navigation library and is used to navigate between screens, pass parameters, and handle navigation
 * events.
 * @returns The function `useReminders` returns an object with the following properties and values:
 **/
const useReminders = (navigation, {params}) => {
  const data = params;
  const modalizeRef = useRef(null);
  const [selected, setSelected] = useState({});
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [listData, setListData] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  /**
   * The function `showDatePicker` sets the visibility of a date picker to true.
   **/
  const showDatePicker = () => setDatePickerVisibility(true);

  /**
   * The function `hideDatePicker` is used to set the visibility of a date picker to false.
   **/
  const hideDatePicker = () => setDatePickerVisibility(false);

  /**
   * The closeRow function takes a rowMap and a rowKey as parameters and calls the closeRow method on
   * the row object corresponding to the rowKey in the rowMap.
   * @param rowMap - An object that maps row keys to row objects.
   * @param rowKey - The `rowKey` parameter is a key that is used to access a specific row in the
   * `rowMap` object.
   **/
  const closeRow = (rowMap, rowKey) => rowMap[rowKey]?.closeRow();

  /**
   * The `deleteRow` function deletes a row from a table by making an API call to delete a reminder and
   * then refreshing the table.
   * @param rowMap - The `rowMap` parameter is an object that represents the mapping of row keys to
   * their corresponding row data in a list or table. It is used to access the data of a specific row
   * using its key.
   * @param rowKey - The `rowKey` parameter is the key or index of the row that needs to be deleted
   * from the `rowMap` object.
   **/
  const deleteRow = async (rowMap, rowKey) => {
    const {ok} = await API.delete(`/delete-reminder/${listData[rowKey]?.id}`);
    if (ok) onRefresh();
  };

  /**
   * The `onOpen` function opens a modal if the `modalizeRef` is defined.
   **/
  const onOpen = () => modalizeRef.current?.open();
  /**
   * The function `onClose` resets certain variables and closes a modal.
   **/
  const onClose = () => {
    setTitle('');
    setDisabled(false);
    setSelected({});
    setTime('');
    modalizeRef.current?.close();
  };

  /**
   * The function "reminderDetail" navigates to the "ReminderDetail" screen with the given parameters.
   **/
  const reminderDetail = params =>
    navigation.navigate('ReminderDetail', params);

  /**
   * The function `onRefresh` makes an API call to retrieve user reminders and updates the list data if
   * the call is successful.
   **/
  const onRefresh = async () => {
    const {ok, data} = await API.get('/user-reminder');
    if (ok) setListData(data.reminders);
  };

  /**
   * The `onRowOpen` function closes a row in a specified row map after a delay of 2000 milliseconds.
   * @param rowKey - The `rowKey` parameter is the unique identifier for the row that was opened. It is
   * used to access the specific row in the `rowMap` object.
   * @param rowMap - The `rowMap` parameter is an object that maps row keys to row references. It is
   * used to manipulate the rows in a list or table component. In this case, it is used to close the
   * row with the specified `rowKey` after a delay of 2000 milliseconds (2 seconds
   **/
  const onRowOpen = (rowKey, rowMap) => {
    setTimeout(() => {
      rowMap[rowKey]?.closeRow();
    }, 2000);
  };

  /**
   * The function `onSave` is an asynchronous function that saves a notification by making a POST
   * request to an API endpoint, either to update an existing reminder or add a new one, and then
   * refreshes the data and closes the modal.
   * @returns The function `onSave` returns nothing.
   **/
  const onSave = async () => {
    if (time == '') return showError('Please select time');
    const notification = {
      ...(selected?.id && {id: selected.id}),
      title: title || 'Default Title',
      time,
    };
    const url = selected?.id ? `/update-reminder` : '/add-reminder';
    const {ok} = await API.post(url, notification);
    if (ok) onRefresh();
    onClose();
  };

  /**
   * The `onEdit` function opens a modal and sets the selected notification's title and time.
   * @param rowMap - The `rowMap` parameter is likely an object that maps row keys to their
   * corresponding data. It is used to retrieve the data for a specific row based on its key.
   * @param rowKey - The `rowKey` parameter is the unique identifier of the row in the `rowMap` object.
   * It is used to identify the specific row that triggered the `onEdit` function.
   **/
  const onEdit = async (rowMap, rowKey) => {
    const selectedNotification = listData[rowKey];
    const {title, time} = selectedNotification;
    modalizeRef.current?.open();
    setSelected(selectedNotification);
    setTitle(title);
    setTime(time);
  };

  /** The code `() => { const event = navigation.addListener('focus', onRefresh); if (data?.setReminder)
  onOpen(); return event; }` is a function that is being passed as a callback to the `useEffect`
  hook. **/
  useEffect(() => {
    const event = navigation.addListener('focus', onRefresh);
    if (data?.setReminder) onOpen();
    return event;
  }, []);
  return {
    data,
    title,
    listData,
    disabled,
    modalizeRef,
    isDatePickerVisible,
    time,
    onEdit,
    setTime,
    onOpen,
    onSave,
    onClose,
    closeRow,
    setTitle,
    onRefresh,
    onRowOpen,
    deleteRow,
    setDisabled,
    reminderDetail,
    showDatePicker,
    hideDatePicker,
  };
};

export default useReminders;
