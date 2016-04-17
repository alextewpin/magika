export function filterList (list, searchValue) {
  return list.filter(item => item.indexOf(searchValue) !== -1);
}

export function filterGroupedList (groupedList, searchValue) {
  return groupedList.map(group => filterList(group, searchValue));
}

export function filterListWithBookmarks (list, bookmarks) {
  return list.filter(item => bookmarks.indexOf(item) !== -1);
}

export function filterGroupedListWithBookmarks (groupedList, bookmarks) {
  return groupedList.map(group => filterListWithBookmarks(group, bookmarks));
}

export function isGroupedListEmpty (groupedList) {
  return !groupedList.some(group => group.length > 0);
}

export function getListDataForCategory (category, data, searchValue = '', showAll) {
  const _data = data[category];
  const out = {
    category,
    filteredList: filterList(_data.list, searchValue),
    dictionary: _data.dictionary
  };
  if (showAll) {
    out.showAll = showAll.indexOf(category) !== -1;
  }
  return out;
}

export function getGroupedListDataForCategory (category, filter, data, searchValue, filterValue) {
  const _data = data[category];
  const fullGroupedList = _data[filter].groupedLists[_data[filter].options[filterValue]];
  const filteredGroupedList = filterGroupedList(fullGroupedList, searchValue);
  return {
    category,
    options: _data[filter].options,
    fullGroupedList,
    filteredGroupedList,
    dictionary: _data.dictionary,
    isEmpty: isGroupedListEmpty(filteredGroupedList)
  };
}

export function getBookmarksListForCategory (category, data, bookmarksData) {
  const _data = data[category];
  return {
    category,
    filteredList: filterListWithBookmarks(_data.list, bookmarksData[category]),
    dictionary: _data.dictionary,
    isEmpty: bookmarksData[category].length === 0
  };
}

export function getGroupedBookmarksListForCategory (category, filter, data, bookmarksData) {
  const _data = data[category];
  const unfilteredFullGroupedList = _data[filter].groupedLists[_data[filter].options[0]];
  const fullGroupedList = filterGroupedListWithBookmarks(unfilteredFullGroupedList, bookmarksData[category]);
  return {
    category,
    fullGroupedList,
    filteredGroupedList: fullGroupedList,
    dictionary: _data.dictionary,
    isEmpty: isGroupedListEmpty(fullGroupedList)
  };
}
