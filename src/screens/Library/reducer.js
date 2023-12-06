import {contentDataList} from '../../utils/helper/LocalDb';

const onFilterSelect = ({min, max}) => {
  const getMax = Boolean(max != undefined);
  return initialState[initialState.marked?.name].filter(i => {
    const timeCat = Number(Math.floor(i?.duration));
    return getMax ? timeCat >= min && timeCat <= max : timeCat >= min;
  });
};

export const reducer = (state, action) => {
  const {payload, type} = action;
  if (action.type == 'update_Reducer') return {...state, ...action.payload};
  else if (action.type == 'filter_data')
    return {...state, [initialState.marked?.name]: onFilterSelect(payload)};
  return state;
};

export const initialState = {
  marked: contentDataList[0],
  Hypnosis: [],
  Meditation: [],
  Affirmations: [],
  Courses: [],
  Series: [],
  Scripts: [],
  Videos: [],
  EBooks: [],
  categories: [],
  request_url: '',
  selectedCategory: '',
};
