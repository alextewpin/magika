import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

function getCategories () {
  return {
    SPELLBOOK: [],
    BESTIARY: [],
    CLASSES: []
  };
}

function setBookmarks () {
  return {};
}

const initialState = {
  isLoading: true,
  searchValue: '',
  filterValue: 0,
  showAll: [],
  data: {}
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
        searchValue: action.value.toLowerCase().replace(/\s/g, '_').replace(/\//g, '_'),
        showAll: []
      };
    case 'CLEAR_SEARCH':
      return {
        ...state,
        searchValue: '',
        showAll: []
      };
    case 'FILTER':
      return {
        ...state,
        filterValue: action.value
      };
    case 'SHOW_ALL':
      return {
        ...state,
        showAll: [...state.showAll, action.category]
      };
    case '@@router/LOCATION_CHANGE':
      return {
        ...state,
        searchValue: action.payload.query.searchValue || '',
        filterValue: 0,
        showAll: []
      };
    default:
      return state;
  }
}

function toggle (state, action) {
  const index = state[action.category].indexOf(action.value);
  if (index !== -1) {
    return {
      ...state,
      [action.category]: [
        ...state[action.category].slice(0, index),
        ...state[action.category].slice(index + 1)
      ]
    };
  }
  return {
    ...state,
    [action.category]: [...state[action.category], action.value]
  };
}

function expanded (state = getCategories(), action) {
  switch (action.type) {
    case 'TOGGLE_EXPAND':
      return toggle(state, action);
    case 'SEARCH':
      return getCategories();
    case 'CLEAR_SEARCH':
      return getCategories();
    case 'FILTER':
      return getCategories();
    case '@@router/LOCATION_CHANGE':
      return getCategories();
    default:
      return state;
  }
}

function bookmarks (state = getCategories(), action) {
  switch (action.type) {
    case 'TOGGLE_BOOKMARK':
      return toggle(state, action);
    default:
      return state;
  }
}

export default combineReducers({
  app,
  bookmarks,
  expanded,
  routing: routerReducer
});
