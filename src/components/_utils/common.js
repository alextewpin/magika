export function filterList (list, searchValue) {
  return list.filter(item => {
    return item.toLowerCase().indexOf(searchValue.toLowerCase().replace(/\s/g, '_').replace(/\//g, '_')) !== -1;
  });
}
