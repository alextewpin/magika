import styles from './styles.scss';

import { connect } from 'react-redux';
import { filterGroupedList, isGroupedListNotEmpty } from '_utils/common';

import Message from 'Message';
import Search from 'Search';
import Filter from 'Filter';
import GroupedList from 'GroupedList';

function Spellbook ({ classesList, fullGroupedList, filteredGroupedList, dictionary }) {
  function makeTitleFromIndex (index) {
    if (index === 0) {
      return 'Cantrips';
    } else {
      return `Level ${index}`;
    }
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
      <Filter list={classesList} allSuffix='spells'/>
      <GroupedList {...{ fullGroupedList, filteredGroupedList, dictionary, makeTitleFromIndex }}/>
      {getNotFound()}
    </div>
  );
}

function mapStateToProps (state) {
  const { data, searchValue, filterValue } = state.app;
  const fullGroupedList = data.SPELLS_CHAR_FILTER_LISTS[data.SPELLS_CHAR_FILTERS[filterValue]];
  return {
    classesList: data.SPELLS_CHAR_FILTERS,
    fullGroupedList,
    filteredGroupedList: filterGroupedList(fullGroupedList, searchValue),
    dictionary: data.SPELLS_BY_KEY
  };
}

export default connect(
  mapStateToProps
)(ReactCSS(Spellbook, styles));
