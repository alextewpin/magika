import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

function getBookmarks () {
  return {};
}

const initialState = {
  isLoading: true,
  searchValue: '',
  data: {},
  bookmarks: getBookmarks()
};

function app (state = initialState, action) {
  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        isLoading: false,
        data: action.data
      };
    case 'SEARCH':
      return {
        ...state,
        searchValue: action.value
      }
    case 'CLEAR_SEARCH':
      return {
        ...state,
        searchValue: ''
      }
    default:
      return state;
  }
}

export default combineReducers({
  app,
  routing: routerReducer
});
