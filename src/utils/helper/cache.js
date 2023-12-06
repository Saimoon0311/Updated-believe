import {MMKV} from 'react-native-mmkv';
export const storage = new MMKV();
// console.log('first', storage.getAllKeys());
const prefix = 'cache';
// const expiryInMinutes = 5;
const store = async (key, value) => {
  const item = {
    value,
    timeStamp: Date.now(),
  };
  storage.set(prefix + key, JSON.stringify(item));
};

/**
 * The function retrieves a value from storage based on a given key, after performing some validity
 * checks.
 * @returns The value of the "value" property of the item object.
 */
/**
 * The function retrieves a value from storage based on a given key, after performing some validity
 * checks.
 * @returns The value of the "value" property of the item object.
 */
const get = key => {
  const isValid = storage.contains(prefix + key);
  if (!isValid) return null;
  const value = storage.getString(prefix + key);
  const item = JSON.parse(value);
  if (!item) return null;

  return item.value;
};

export default {store, get, storage};
