import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

function getBookmarks () {
  return {};
}

const initialState = {
  isLoading: true,
  searchValue: '',
  filterValue: 0,
  showAll: [],
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
        searchValue: action.value,
        showAll: []
      }
    case 'CLEAR_SEARCH':
      return {
        ...state,
        searchValue: '',
        showAll: []
      }
    case 'FILTER':
      return {
        ...state,
        filterValue: action.value
      }
    case 'SHOW_ALL':
      return {
        ...state,
        showAll: [...state.showAll, action.category]
      }
    case '@@router/LOCATION_CHANGE':
      return {
        ...state,
        searchValue: action.payload.query.searchValue || '',
        filterValue: 0,
        showAll: []
      }
    default:
      return state;
  }
}

export default combineReducers({
  app,
  routing: routerReducer
});
