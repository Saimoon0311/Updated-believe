import useReduxStore from '../../hooks/useReduxStore';
import {logOutUser} from '../../store/actions/auth-action';
import {useState, useEffect} from 'react';
import {
  getRecentlySearch,
  getSuggestedKeyword,
  searching,
} from '../../store/actions/onboard-action';
import {useSelector} from 'react-redux';
import API from '../../services/API';
import {store} from '../../store/store';
import TrackPlayer from 'react-native-track-player';
import {musicSwitch} from '../../utils/helper';

/**
 * The `useSearch` function is a custom hook in JavaScript that handles search functionality, including
 * suggested keywords, recent search data, searching results, and navigation.
 * @returns The function `useSearch` returns an object with the following properties:
 **/
const useSearch = ({navigation}) => {
  const {dispatch} = useReduxStore();
  const {Auth} = store.getState('Auth');
  const logOutHandler = () => dispatch(logOutUser());

  const recentSearchData = useSelector(state => state.OnBoard.recentlySearch);
  const suggestKeyword = useSelector(state => state.OnBoard.suggestedSearch);
  const searchingResult = useSelector(state => state.OnBoard.searchingResult);

  const [value, setValue] = useState('');

  const [search, setSearch] = useState('');
  const [SuggestedData, setSuggestedData] = useState([]);
  const [searchingResultData, setsearchingResultData] = useState([]);

  /**
   * The GoNext function navigates to the 'Player' screen with the data and search parameters if the
   * search length is not empty.
   **/
  const GoNext = () =>
    search?.length && navigation.navigate('Player', {...data, search});

  /**
   * The function `selectKeyword` takes an item as input, updates the `SuggestedData` array by adding
   * or removing the item, updates the value and performs a search based on the updated `SuggestedData`
   * array.
   **/
  const selectKeyword = item => {
    const newsuggestedData = [...SuggestedData];
    const index = newsuggestedData.indexOf(item);
    if (index > -1) {
      newsuggestedData.splice(index, 1);
    } else {
      newsuggestedData.push(item);
    }
    setSuggestedData(newsuggestedData);
    setValue(newsuggestedData.map(item => item.queries).join(' '));
    searcData(newsuggestedData.map(item => item.queries).join(' '));
    // dispatch(searching(newsuggestedData.map(item => item.queries).join(' ')));
  };

  /**
   * The function `playAudio` posts recent search audio data and navigates to the music player screen
   * with the provided parameters.
   **/
  const playAudio = async params => {
    await API.post('recent-search-audio', {
      id: params.id,
      type: params.type,
    });
    await musicSwitch(false);
    navigation.navigate('MusicPlayer', {...params, isSeries: false});
  };

  /**
   * The function `_setSearch` sets the search text, performs a search, and potentially dispatches an
   * action.
   **/
  const _setSearch = searchText => {
    setSearch(searchText);
    searcData(searchText);
    // dispatch(searching(searchText));
  };

  /**
   * The function "onRefresh" clears the search input, dispatches actions to get suggested keywords and
   * recently searched items, and sets the suggested data to an empty array.
   **/
  const onRefresh = () => {
    dispatch(getSuggestedKeyword());
    dispatch(getRecentlySearch());
    setSearch('');
    setSuggestedData([]);
  };

  /**
   * The function `searcData` makes a GET request to an API endpoint with a specific tag parameter, and
   * then processes the response to set the `searchingResultData` variable based on the result.
   **/
  const searcData = params => {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${Auth.token}`);
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    fetch(
      `https://api.believehypnosis.app/api/search2?tag=${params}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        if (result.audios.length >= 0) setsearchingResultData(result.audios);
        else if (result.audios.length == 0) setsearchingResultData([]);
      })
      .catch(error => setsearchingResultData([]));
  };

  /**
   * The function `_setResultData` clears the searching result data and suggested data.
   **/
  const _setResultData = () => {
    setsearchingResultData([]);
    setSuggestedData([]);
    // store.dispatch({ searchingResultData: [] })
  };

  /**
   * The function "viewAll" navigates to the "ViewAll" screen with the given parameters.
   **/
  const viewAll = params => {
    navigation.navigate('ViewAll', params);
  };

  /** The code `() => { const event = navigation.addListener('focus', () => onRefresh());
  setSuggestedData([]); return event; }` is a function that is being called inside the `useEffect`
  hook. **/
  useEffect(() => {
    const event = navigation.addListener('focus', () => onRefresh());
    setSuggestedData([]);
    return event;
  }, []);

  return {
    SuggestedData,
    suggestKeyword,
    recentSearchData,
    search,
    _setSearch,
    searchingResult,
    _setResultData,
    searchingResultData,
    value,
    setValue,
    GoNext,
    selectKeyword,
    logOutHandler,
    playAudio,
    viewAll,
  };
};

export default useSearch;
