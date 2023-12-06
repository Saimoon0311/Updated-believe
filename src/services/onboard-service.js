import API from './API';

export const GoalsService = () => API.get('/goals');
export const FeelingsService = () => API.get('/feelings');
export const TrackService = () => API.get('/tracks');
export const OnboardFinalizeService = param =>
  API.post('/add-user-goal', param);

// export const Search = param => API.get(`/search-audios?title=${param}`);
export const Search = param => API.get(`/search2?tag=${param}`);
export const RecentlySearch = () => API.get('/recent-search');
export const SuggestedSearch = () => API.get('/suggest-keywords');
