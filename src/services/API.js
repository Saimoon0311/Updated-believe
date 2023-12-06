import {create} from 'apisauce';
import {baseURL} from '../config/constants';
import {store} from '../store/store';
import {logOutUser, updateAuth} from '../store/actions/auth-action';
import cache from '../utils/helper/cache';

const API = create({
  baseURL,
  timeout: 15000,
  timeoutErrorMessage: 'Please try Again...',
});

const hideLoaderAPIs = [
  '/playcount',
  '/playlist',
  '/count-streak',
  '/favorite',
  '/goals',
  '/get-all-achievements',
];
// const hideLoaderAPIs = ['/playcount', '/playlist', '/home-content'];

/** This code is a request transform function that is added to the API instance. It is executed before
each request is made. **/
API.addRequestTransform(config => {
  if (!hideLoaderAPIs.includes(config.url))
    store.dispatch(updateAuth({loading: true}));
  const {Auth} = store.getState();
  console.log('Auth token', Auth.token);
  config.headers = {
    Authorization: `Bearer ${Auth.token}`,
  };
  return config;
});

/** The `API.addResponseTransform` function is adding a response transform function to the API instance.
This function is executed after each response is received. **/
API.addResponseTransform(response => {
  setTimeout(() => store.dispatch(updateAuth({loading: false})), 1000);
  const {Auth} = store.getState();
  if (
    response?.originalError?.message == 'Request failed with status code 401' &&
    Auth.token
  )
    store.dispatch(logOutUser());
  return response;
});

const {get} = API;

//^ altering the get()
/** The code block `async (url, params, axiosConfig) => {...}` is overriding the default behavior of the
`get()` function in the `API` object. **/
API.get = async (url, params, axiosConfig) => {
  const response = await get(url, params, axiosConfig);
  if (response.ok) {
    cache.store(url, response.data); //* caching the response
    return response;
  }
  const data = cache.get(url); //* retrieving the data from the cache
  return data ? {ok: true, data} : response;
};

export default API;
