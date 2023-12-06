import {storage} from '../utils/helper/cache';

const storeToken = (key, value) => storage.set(key, value);
const setTimerToken = (key, value) => storage.set(key, JSON.stringify(value));
const getTimerTokem = key => JSON.parse(storage.getString(key));
const getToken = () => storage.getString('USER/TOKEN');

const storeValue = (key, value) => storage.set(key, value);
const storeDownloadedFiles = (key, value) =>
  storage.set(key, JSON.stringify(value));
const getValue = key => storage.getString(key);
const getDownloadedFiles = key => storage.getString(key);

const removeToken = () => {
  storage.clearAll();
  storeOnBoardToken('ONBOARD/TOKEN', 'true');
};
/**
 * The function `storeOnBoardToken` is used to store a key-value pair in the storage.
 * @param key - The key is a unique identifier used to store and retrieve the value from storage. It
 * can be any string or number that you choose.
 * @param value - The value parameter is the data that you want to store in the storage. It can be any
 * valid JavaScript value, such as a string, number, object, or array.
 **/
const storeOnBoardToken = (key, value) => storage.set(key, value);
/**
 * The function `getOnBoardToken` retrieves a string value from storage with the key 'ONBOARD/TOKEN'.
 **/
const getOnBoardToken = () => storage.getString('ONBOARD/TOKEN');

/**
 * The function `saveReminders` saves reminders to local storage by converting them to a JSON string.
 **/
const saveReminders = reminders =>
  storage.set('reminders', JSON.stringify(reminders));

/**
 * The function `getReminders` retrieves a string value from storage with the key 'reminders'.
 **/
const getReminders = () => storage.getString('reminders');
const hasKey = key => storage.contains(key);

export {
  storeToken,
  getToken,
  setTimerToken,
  getTimerTokem,
  storeOnBoardToken,
  getOnBoardToken,
  removeToken,
  saveReminders,
  getReminders,
  hasKey,
  storeValue,
  getValue,
  storeDownloadedFiles,
  getDownloadedFiles,
};
