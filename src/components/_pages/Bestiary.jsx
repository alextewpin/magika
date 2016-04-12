import { connect } from 'react-redux';
import { filterGroupedList, isGroupedListNotEmpty } from '_utils/common';

import Message from 'Message';
import Search from 'Search';
import Filter from 'Filter';
import GroupedList from '_lists/GroupedList';

function Bestiary ({ typesList, filteredGroupedList, ...rest }) {
  function makeCRFromIndex (index) {
    switch (index) {
      case 0: return '0';
      case 1: return '1/8';
      case 2: return '1/4';
      case 3: return '1/2';
      default: return String(index - 3);
    }
  }
  function makeTitleFromIndex (index) {
    return `Challenge ${makeCRFromIndex(index)}`;
  }
  function getNotFound () {
    if (isGroupedListNotEmpty(filteredGroupedList)) {
      return null;
    }
    return <Message type='NOT_FOUND'/>;
  }
  return (
    <div>
      <Search/>
      <Filter list={typesList} allSuffix='monsters'/>
      <GroupedList category='BESTIARY' {...{ filteredGroupedList, makeTitleFromIndex }} {...rest}/>
      {getNotFound()}
    </div>
  );
}

function mapStateToProps (state) {
  const { data, searchValue, filterValue } = state.app;
  const fullGroupedList = data.MONSTER_TYPE_FILTER_LISTS[data.MONSTER_TYPE_FILTERS[filterValue]];
  return {
    typesList: data.MONSTER_TYPE_FILTERS,
    fullGroupedList,
    filteredGroupedList: filterGroupedList(fullGroupedList, searchValue),
    dictionary: data.MONSTERS_BY_KEY
  };
}

export default connect(
  mapStateToProps
)(Bestiary);
