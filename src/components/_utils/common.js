export function filterList (list, searchValue) {
  return list.filter(item => item.indexOf(searchValue) !== -1);
}

export function filterGroupedList (groupedList, searchValue) {
  return groupedList.map(group => filterList(group, searchValue));
}

export function isGroupedListNotEmpty (groupedList) {
  return groupedList.some(group => group.length > 0);
}
