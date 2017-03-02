import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

function getCategories () {
  return {
    SPELLBOOK: [],
    BESTIARY: [],
    ITEMS: [],
    CLASSES: []
  };
}

function getBookmarks () {
  try {
    const bm = JSON.parse(window.localStorage.bookmarks);
    // Some tweaks to support legacy bookmarks style
    return Object.keys(bm).reduce((sum, key) => {
      return Object.assign({}, sum, {
        [key.toUpperCase()]: bm[key].map(item => item.toLowerCase())
      });
    }, getCategories());
  } catch (err) {
    console.log(err);
    return getCategories();
  }
}

function setBookmarks (bm) {
  window.localStorage.bookmarks = JSON.stringify(bm);
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


function isLoading (state = true, action) {
  if (action.type === 'INIT') {
    return false;
  } else {
    return state;
  }
}

function data (state = {}, action) {
  if (action.type === 'INIT') {
    return action.data;
  } else {
    return state;
  }
}

function searchValue (state = '', action) {
  switch (action.type) {
    case 'SEARCH':
      return action.value.toLowerCase().replace(/\s/g, '_').replace(/\//g, '_');
    case 'CLEAR_SEARCH':
      return '';
    case '@@router/LOCATION_CHANGE':
      return action.payload.query.searchValue || '';
    default:
      return state;
  }
}

function filterValue (state = 0, action) {
  switch (action.type) {
    case 'FILTER':
      return action.value;
    case '@@router/LOCATION_CHANGE':
      return 0;
    default:
      return state;
  }
}

function showAll (state = [], action) {
  switch (action.type) {
    case 'SHOW_ALL':
      return [...state, action.category];
    case 'SEARCH':
      return [];
    case 'CLEAR_SEARCH':
      return [];
    case '@@router/LOCATION_CHANGE':
      return [];
    default:
      return state;
  }
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

function bookmarks (state = getBookmarks(), action) {
  switch (action.type) {
    case 'TOGGLE_BOOKMARK':
      setBookmarks(toggle(state, action));
      return toggle(state, action);
    default:
      return state;
  }
}

export default combineReducers({
  isLoading,
  data,
  searchValue,
  filterValue,
  bookmarks,
  expanded,
  showAll,
  routing: routerReducer
});
