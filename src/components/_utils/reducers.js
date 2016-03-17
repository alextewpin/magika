function getBookmarks () {
  return {};
}

const initialState = {
  isLoading: true,
  data: {},
  bookmarks: getBookmarks()
};

export default function reducers (state = initialState, action) {
  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        data: action.data,
        isLoading: false
      };
    default:
      return state;
  }
}
